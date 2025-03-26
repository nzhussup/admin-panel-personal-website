package controller

import (
	"errors"
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AlbumController struct {
	service *service.Service
}

func (ctrl *AlbumController) Get(c *gin.Context) {
	pathParam := c.Param("id")
	album, err := ctrl.service.AlbumService.GetAlbum(pathParam)
	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrBadRequest):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return

	}

	c.JSON(http.StatusOK, album)
}

func (ctrl *AlbumController) GetPreview(c *gin.Context) {
	album, err := ctrl.service.AlbumService.GetAlbumsPreview()

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, album)
}

func (ctrl *AlbumController) Create(c *gin.Context) {
	var request model.AlbumPreview
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdAlbum, err := ctrl.service.AlbumService.CreateAlbum(&request)
	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrConflict):
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return

	}

	c.JSON(http.StatusCreated, gin.H{"message": "Album created successfully",
		"data": createdAlbum})
}

func (ctrl *AlbumController) Delete(c *gin.Context) {
	pathParam := c.Param("id")
	err := ctrl.service.AlbumService.DeleteAlbum(pathParam)
	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrBadRequest):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return

	}
	c.JSON(http.StatusOK, gin.H{"message": "Album deleted successfully"})
}

func (ctrl *AlbumController) Update(c *gin.Context) {
	var request model.AlbumPreview
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pathParam := c.Param("id")

	updatedAlbum, err := ctrl.service.AlbumService.UpdateAlbum(pathParam, &request)

	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Album updated successfully",
		"data": updatedAlbum})

}

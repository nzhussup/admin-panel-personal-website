package controller

import (
	"errors"
	"fmt"
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AlbumController struct {
	service *service.Service
}

var validTypes = map[string]bool{
	"private":     true,
	"public":      true,
	"semi-public": true,
	"all":         true,
}

func (ctrl *AlbumController) Get(c *gin.Context) {
	pathParam := c.Param("id")
	album, err := ctrl.service.AlbumService.GetAlbum(c, pathParam)
	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrBadRequest):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrUnauthorized):
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrForbidden):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrInternalServer):
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return

	}

	if album.Images == nil {
		album.Images = []*model.Image{}
	}

	c.JSON(http.StatusOK, album)
}

func (ctrl *AlbumController) GetPreview(c *gin.Context) {
	typeQuery := c.DefaultQuery("type", "public")

	if !validTypes[typeQuery] {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid type. should be one of %v", validTypes)})
		return
	}

	album, err := ctrl.service.AlbumService.GetAlbumsPreview(typeQuery)

	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrBadRequest):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrUnauthorized):
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrForbidden):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}
	if album == nil {
		album = []*model.AlbumPreview{}
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

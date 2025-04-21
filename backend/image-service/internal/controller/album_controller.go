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

// Get godoc
// @Summary Get a specific album by ID
// @Description Returns album metadata and images
// @Tags Album
// @Produce json
// @Param id path string true "Album ID"
// @Success 200 {object} model.Album
// @Failure 400 {object} map[string]string "Bad Request"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 404 {object} map[string]string "Not Found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album/{id} [get]
// @Security ApiKeyAuth
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

// GetPreview godoc
// @Summary Get album previews
// @Description Returns a preview list of albums, filtered by type
// @Tags Album
// @Produce json
// @Param type query string false "Album type (public, semi-public, private, all)" Enums(public, semi-public, private, all) default(public)
// @Success 200 {array} model.AlbumPreview
// @Failure 400 {object} map[string]string "Bad Request"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album [get]
// @Security ApiKeyAuth
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

// Create godoc
// @Summary Create a new album
// @Description Creates an album with basic metadata
// @Tags Album
// @Accept json
// @Produce json
// @Param album body model.AlbumPreview true "Album preview data"
// @Success 201 {object} map[string]interface{} "Album created successfully"
// @Failure 400 {object} map[string]string "Bad Request"
// @Failure 404 {object} map[string]string "Not Found"
// @Failure 409 {object} map[string]string "Conflict"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album [post]
// @Security ApiKeyAuth
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

// Delete godoc
// @Summary Delete an album
// @Description Deletes the album and all associated data
// @Tags Album
// @Produce json
// @Param id path string true "Album ID"
// @Success 200 {object} map[string]string "Album deleted successfully"
// @Failure 400 {object} map[string]string "Bad Request"
// @Failure 404 {object} map[string]string "Not Found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album/{id} [delete]
// @Security ApiKeyAuth
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

// Update godoc
// @Summary Update an album
// @Description Updates album metadata
// @Tags Album
// @Accept json
// @Produce json
// @Param id path string true "Album ID"
// @Param album body model.AlbumPreview true "Updated album preview data"
// @Success 200 {object} map[string]interface{} "Album updated successfully"
// @Failure 400 {object} map[string]string "Bad Request"
// @Failure 404 {object} map[string]string "Not Found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album/{id} [put]
// @Security ApiKeyAuth
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

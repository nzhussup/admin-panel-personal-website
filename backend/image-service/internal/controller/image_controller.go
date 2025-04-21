package controller

import (
	"errors"
	"fmt"
	custom_errors "image-service/internal/errors"
	"image-service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ImageController struct {
	service *service.Service
}

// Upload godoc
// @Summary Upload image(s) to an album
// @Description Upload one or more image files to the specified album
// @Tags Image
// @Accept multipart/form-data
// @Produce json
// @Param id path string true "Album ID"
// @Param file formData file true "Image file(s) to upload"
// @Success 201 {object} map[string]interface{} "Image uploaded successfully"
// @Failure 400 {object} map[string]string "Bad Request"
// @Failure 404 {object} map[string]string "Album Not Found"
// @Failure 409 {object} map[string]string "Conflict"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album/{id}/upload [post]
// @Security ApiKeyAuth
func (ctrl *ImageController) Upload(c *gin.Context) {
	albumID := c.Param("id")

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get multipart form"})
		return
	}

	files := form.File["file"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No files uploaded"})
		return
	}

	savedImage, err := ctrl.service.ImageService.UploadImage(albumID, files)
	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrBadRequest):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrConflict):
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Image uploaded successfully",
		"data": savedImage})
}

// Delete godoc
// @Summary Delete an image from an album
// @Description Deletes an image by ID from the given album
// @Tags Image
// @Produce json
// @Param id path string true "Album ID"
// @Param imageID path string true "Image ID"
// @Success 200 {object} map[string]string "Image deleted successfully"
// @Failure 400 {object} map[string]string "Bad Request"
// @Failure 404 {object} map[string]string "Image Not Found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album/{id}/{imageID} [delete]
// @Security ApiKeyAuth
func (ctrl *ImageController) Delete(c *gin.Context) {
	albumID := c.Param("id")
	imageID := c.Param("imageID")

	err := ctrl.service.ImageService.DeleteImage(albumID, imageID)
	if err != nil {
		switch {
		case errors.Is(err, custom_errors.ErrBadRequest):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case errors.Is(err, custom_errors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

// Serve godoc
// @Summary Serve an image file
// @Description Returns the raw image file for preview or download
// @Tags Image
// @Produce octet-stream
// @Param id path string true "Album ID"
// @Param imageID path string true "Image ID"
// @Success 200 {file} file "Image file"
// @Failure 400 {object} map[string]string "Bad Request"
// @Router /v1/album/{id}/{imageID} [get]
// @Security ApiKeyAuth
func (ctrl *ImageController) Serve(c *gin.Context) {
	albumID := c.Param("id")
	imageID := c.Param("imageID")
	imagePath, err := ctrl.service.ImageService.ServeImage(albumID, imageID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to serve image: %s", err.Error())})
		return
	}

	c.File(imagePath)
}

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

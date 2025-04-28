package controller

import (
	custom_errors "image-service/internal/errors"
	"image-service/internal/json"
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
// @Success 201 {object} model.SuccessResponse{data=[]model.Image} "Image uploaded successfully"
// @Failure 400 {object} model.ErrorDetails "Bad Request"
// @Failure 404 {object} model.ErrorDetails "Album Not Found"
// @Failure 409 {object} model.ErrorDetails "Conflict"
// @Failure 500 {object} model.ErrorDetails "Internal Server Error"
// @Router /v1/album/{id}/upload [post]
// @Security ApiKeyAuth
func (ctrl *ImageController) Upload(c *gin.Context) {
	albumID := c.Param("id")

	form, err := c.MultipartForm()
	if err != nil {
		json.ConstructJsonResponseError(c, custom_errors.NewError(custom_errors.ErrBadRequest, "Failed to get multipart form"), http.StatusBadRequest)
		return
	}

	files := form.File["file"]
	if len(files) == 0 {
		json.ConstructJsonResponseError(c, custom_errors.NewError(custom_errors.ErrBadRequest, "No files uploaded"), http.StatusBadRequest)
		return
	}

	savedImage, err := ctrl.service.ImageService.UploadImage(albumID, files)
	if err != nil {
		custom_errors.MapErrors(c, err)
		return
	}
	json.ConstructJsonResponseSuccess(c, savedImage, http.StatusCreated, "Image(s) uploaded successfully")
}

// Delete godoc
// @Summary Delete an image from an album
// @Description Deletes an image by ID from the given album
// @Tags Image
// @Produce json
// @Param id path string true "Album ID"
// @Param imageID path string true "Image ID"
// @Success 200 {object} model.SuccessResponse{data=nil} "Image deleted successfully"
// @Failure 400 {object} model.ErrorDetails "Bad Request"
// @Failure 404 {object} model.ErrorDetails "Image Not Found"
// @Failure 500 {object} model.ErrorDetails "Internal Server Error"
// @Router /v1/album/{id}/{imageID} [delete]
// @Security ApiKeyAuth
func (ctrl *ImageController) Delete(c *gin.Context) {
	albumID := c.Param("id")
	imageID := c.Param("imageID")

	err := ctrl.service.ImageService.DeleteImage(albumID, imageID)
	if err != nil {
		custom_errors.MapErrors(c, err)
		return
	}
	json.ConstructJsonResponseSuccess(c, nil, "Image deleted successfully")
}

// Serve godoc
// @Summary Serve an image file
// @Description Returns the raw image file for preview or download
// @Tags Image
// @Produce octet-stream
// @Param id path string true "Album ID"
// @Param imageID path string true "Image ID"
// @Success 200 {file} file "Image file"
// @Failure 400 {object} model.ErrorDetails "Bad Request"
// @Router /v1/album/{id}/{imageID} [get]
// @Security ApiKeyAuth
func (ctrl *ImageController) Serve(c *gin.Context) {
	albumID := c.Param("id")
	imageID := c.Param("imageID")
	imagePath, err := ctrl.service.ImageService.ServeImage(albumID, imageID)
	if err != nil {
		custom_errors.MapErrors(c, err)
		return
	}

	c.File(imagePath)
}

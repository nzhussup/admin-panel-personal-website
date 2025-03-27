package repository

import (
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/utils"
	"os"
	"path/filepath"
	"strings"
)

type ImageRepository struct {
	Path        string
	ApiBasePath string
}

func (i *ImageRepository) Upload(albumID string, image *model.Image) (*model.Image, error) {

	var imageID string
	var imagePath string

	// REPETETIVE ID GENERATION FOR UNIQUE ID
	for {
		imageID = utils.GenerateUUID()
		extension := "." + strings.Split(string(image.Type), "/")[1]
		imagePath = filepath.Join(i.Path, albumID, imageID+extension)
		if _, err := os.Stat(imagePath); os.IsNotExist(err) {
			break
		}
	}

	albumPath := filepath.Join(i.Path, albumID)
	if _, err := os.Stat(albumPath); os.IsNotExist(err) {
		return nil, custom_errors.NewNotFoundError("album not found")
	}

	err := os.MkdirAll(filepath.Dir(imagePath), os.ModePerm)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to create image directory")
	}

	err = os.WriteFile(imagePath, image.Data, os.ModePerm)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to save image data")
	}

	image.ID = strings.Split(imagePath, "/")[len(strings.Split(imagePath, "/"))-1]
	image.Data = nil
	image.URL = filepath.Join(i.ApiBasePath, albumID, image.ID)

	return image, nil
}

func (i *ImageRepository) Delete(albumID string, imageID string) error {
	imagePath := filepath.Join(i.Path, albumID, imageID)
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		return custom_errors.NewNotFoundError("image not found")
	}
	err := os.Remove(imagePath)
	if err != nil {
		return custom_errors.NewInternalServerError("failed to delete image")
	}
	return nil
}

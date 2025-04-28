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

	for {
		imageID = utils.GenerateUUID()
		extension := "." + strings.Split(string(image.Type), "/")[1]
		imagePath = filepath.Join(i.Path, albumID, imageID+extension)
		if _, err := os.Stat(imagePath); os.IsNotExist(err) {
			break
		}
	}

	albumPath := filepath.Join(i.Path, albumID)
	metaDataPath := filepath.Join(albumPath, "meta.json")

	if _, err := os.Stat(albumPath); os.IsNotExist(err) {
		return nil, custom_errors.NewError(custom_errors.ErrNotFound, "album not found")
	}

	lock := getAlbumLock(albumID)
	lock.Lock()
	defer lock.Unlock()

	err := os.MkdirAll(filepath.Dir(imagePath), os.ModePerm)
	if err != nil {
		return nil, custom_errors.NewError(custom_errors.ErrInternalServer, "failed to create image directory")
	}

	err = os.WriteFile(imagePath, image.Data, os.ModePerm)
	if err != nil {
		return nil, custom_errors.NewError(custom_errors.ErrInternalServer, "failed to save image data")
	}

	metaData, err := utils.LoadMetaData(metaDataPath)
	if err != nil {
		return nil, err
	}

	err = utils.IncrementImageCountMeta(metaDataPath, metaData, 1)
	if err != nil {
		return nil, err
	}

	image.ID = filepath.Base(imagePath)
	image.Data = nil
	image.URL = filepath.Join(i.ApiBasePath, albumID, image.ID)

	return image, nil
}

func (i *ImageRepository) Delete(albumID string, imageID string) error {
	imagePath := filepath.Join(i.Path, albumID, imageID)
	metaDataPath := filepath.Join(i.Path, albumID, "meta.json")

	lock := getAlbumLock(albumID)
	lock.Lock()
	defer lock.Unlock()

	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		return custom_errors.NewError(custom_errors.ErrNotFound, "image not found")
	}

	err := os.Remove(imagePath)
	if err != nil {
		return custom_errors.NewError(custom_errors.ErrInternalServer, "failed to delete image")
	}

	metaData, err := utils.LoadMetaData(metaDataPath)
	if err != nil {
		return err
	}

	err = utils.DecrementImageCountMeta(metaDataPath, metaData, 1)
	if err != nil {
		return err
	}

	return nil
}

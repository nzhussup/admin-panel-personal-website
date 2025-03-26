package service

import (
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/repository"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

type ImageService struct {
	storage *repository.Storage
}

func (s *ImageService) UploadImage(albumID string, file *multipart.FileHeader) (*model.Image, error) {

	fileData, err := file.Open()
	if err != nil {
		return nil, custom_errors.NewBadRequestError("failed to open the file")
	}
	defer fileData.Close()

	image := &model.Image{
		Type: model.ImageType(file.Header["Content-Type"][0]),
	}
	if image.Type != model.JPEG && image.Type != model.PNG && image.Type != model.JPG {
		return nil, custom_errors.NewBadRequestError("invalid image type. only jpeg and png are allowed")
	}

	image.Data, err = io.ReadAll(fileData)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to read image data")
	}

	savedImage, err := s.storage.Image.Upload(albumID, image)
	if err != nil {
		return nil, err
	}
	return savedImage, nil

}

func (s *ImageService) DeleteImage(albumID string, imageID string) error {
	err := s.storage.Image.Delete(albumID, imageID)
	if err != nil {
		return err
	}
	return nil
}

func (s *ImageService) ServeImage(albumID string, imageID string) (string, error) {
	imagePath := filepath.Join(s.storage.Path, albumID, imageID)
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		return "", custom_errors.NewNotFoundError("image not found")
	}
	return imagePath, nil
}

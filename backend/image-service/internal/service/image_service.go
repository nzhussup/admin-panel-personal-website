package service

import (
	"bytes"
	"fmt"
	"image-service/internal/config/cache"
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/repository"
	"image-service/internal/utils"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-playground/validator/v10"
)

type ImageService struct {
	storage  *repository.Storage
	redis    cache.RedisClientInterface
	validate *validator.Validate
}

func (s *ImageService) UploadImage(albumID string, files []*multipart.FileHeader) ([]*model.Image, error) {

	var savedImages []*model.Image

	for _, file := range files {
		contentType := file.Header["Content-Type"][0]
		imageType := model.ImageType(contentType)
		if _, ok := model.AllowedTypes[imageType]; !ok {
			return nil, custom_errors.NewError(custom_errors.ErrBadRequest, fmt.Sprintf("invalid image type: %s. Only JPEG, PNG, and HEIC are allowed", contentType))
		}
	}

	for _, file := range files {
		fileData, err := file.Open()
		if err != nil {
			return nil, custom_errors.NewError(custom_errors.ErrInternalServer, "failed to open image file")
		}
		defer fileData.Close()

		image := &model.Image{
			Type: model.ImageType(file.Header["Content-Type"][0]),
		}
		if image.Type != model.JPEG && image.Type != model.PNG && image.Type != model.JPG && image.Type != model.HEIC {
			return nil, custom_errors.NewError(custom_errors.ErrBadRequest, fmt.Sprintf("invalid image type: %s. Only JPEG, PNG, and HEIC are allowed", image.Type))
		}

		data, err := io.ReadAll(fileData)
		if err != nil {
			return nil, custom_errors.NewError(custom_errors.ErrInternalServer, "failed to read image file")
		}
		reader := bytes.NewReader(data)

		extention := strings.Split(string(image.Type), "/")[1]
		compressedData, err := utils.CompressImage(reader, extention)
		if err != nil {
			return nil, err
		}
		if extention == "heic" {
			image.Type = model.JPEG
		}
		image.Data = compressedData

		savedImage, err := s.storage.Image.Upload(albumID, image)
		if err != nil {
			return nil, err
		}
		savedImages = append(savedImages, savedImage)

		// CACHING
		s.redis.Set(fmt.Sprintf("image:%s:%s", albumID, savedImage.ID), fmt.Sprintf("%s/%s/%s", s.storage.Path, albumID, savedImage.ID))
	}

	s.redis.Del(fmt.Sprintf("album_%s", albumID))

	return savedImages, nil
}

func (s *ImageService) DeleteImage(albumID string, imageID string) error {
	err := s.storage.Image.Delete(albumID, imageID)
	if err != nil {
		return err
	}

	// CACHE EVICTION
	cacheKey := fmt.Sprintf("image:%s:%s", albumID, imageID)
	s.redis.Del(cacheKey)
	s.redis.Del(fmt.Sprintf("album_%s", albumID))

	return nil
}

func (s *ImageService) ServeImage(albumID string, imageID string) (string, error) {
	// CACHE CHECK
	cacheKey := fmt.Sprintf("image:%s:%s", albumID, imageID)
	var cachedImagePath string
	err := s.redis.Get(cacheKey, &cachedImagePath)
	if err == nil {
		return cachedImagePath, nil
	}

	imagePath := filepath.Join(s.storage.Path, albumID, imageID)
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		return "", custom_errors.NewError(custom_errors.ErrNotFound, fmt.Sprintf("image %s not found in album %s", imageID, albumID))
	}

	// CACHING
	s.redis.Set(cacheKey, imagePath)
	return imagePath, nil
}

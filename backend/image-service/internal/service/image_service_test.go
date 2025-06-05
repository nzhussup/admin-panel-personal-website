package service

import (
	"errors"
	"image-service/internal/repository"
	"io"
	"mime/multipart"
	"testing"

	"github.com/go-playground/validator/v10"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func createMockFileHeader(fileName, contentType string, content []byte) *multipart.FileHeader {
	_, pw := io.Pipe()
	go func() {
		pw.Write(content)
		pw.Close()
	}()

	return &multipart.FileHeader{
		Filename: fileName,
		Header:   map[string][]string{"Content-Type": {contentType}},
		Size:     int64(len(content)),
	}
}

func TestUploadImage_InvalidType(t *testing.T) {
	mockImageRepo := new(MockImageRepo)
	mockRedis := new(MockRedisClient)

	svc := &ImageService{
		storage:  &repository.Storage{Image: mockImageRepo},
		redis:    mockRedis,
		validate: validator.New(),
	}

	file := createMockFileHeader("bad.bmp", "image/bmp", []byte("data"))

	_, err := svc.UploadImage("album1", []*multipart.FileHeader{file})

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "invalid image type")
}

func TestServeImage_CacheHit(t *testing.T) {
	mockRedis := new(MockRedisClient)
	svc := &ImageService{
		storage:  &repository.Storage{Path: "/mock/path"},
		redis:    mockRedis,
		validate: validator.New(),
	}

	mockRedis.On("Get", "image:album1:img1", mock.AnythingOfType("*string")).Run(func(args mock.Arguments) {
		ptr := args.Get(1).(*string)
		*ptr = "/mock/path/album1/img1"
	}).Return(nil)

	path, err := svc.ServeImage("album1", "img1")

	assert.NoError(t, err)
	assert.Equal(t, "/mock/path/album1/img1", path)

	mockRedis.AssertExpectations(t)
}

func TestDeleteImage_Success(t *testing.T) {
	mockImageRepo := new(MockImageRepo)
	mockRedis := new(MockRedisClient)

	svc := &ImageService{
		storage:  &repository.Storage{Image: mockImageRepo},
		redis:    mockRedis,
		validate: validator.New(),
	}

	mockImageRepo.On("Delete", "album1", "img1").Return(nil)
	mockRedis.On("Del", "image:album1:img1").Return()
	mockRedis.On("Del", "album_album1").Return()

	err := svc.DeleteImage("album1", "img1")

	assert.NoError(t, err)

	mockImageRepo.AssertExpectations(t)
	mockRedis.AssertExpectations(t)
}

func TestServeImage_FileNotFound(t *testing.T) {
	mockRedis := new(MockRedisClient)
	svc := &ImageService{
		storage:  &repository.Storage{Path: "/non/existent/path"},
		redis:    mockRedis,
		validate: validator.New(),
	}

	mockRedis.On("Get", "image:album1:img1", mock.AnythingOfType("*string")).Return(errors.New("cache miss"))

	_, err := svc.ServeImage("album1", "img1")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "not found")

	mockRedis.AssertExpectations(t)
}

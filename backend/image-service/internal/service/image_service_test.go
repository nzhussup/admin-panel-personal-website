package service

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image-service/internal/model"
	"image-service/internal/repository"
	"image/color"
	"image/jpeg"
	"io"
	"mime/multipart"
	"net/http/httptest"
	"net/textproto"
	"strings"
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

func createValidJPEGFileHeader(fileName string) *multipart.FileHeader {
	// Create an in-memory JPEG image
	img := image.NewRGBA(image.Rect(0, 0, 10, 10))
	for y := 0; y < 10; y++ {
		for x := 0; x < 10; x++ {
			img.Set(x, y, color.RGBA{uint8(x * y), uint8(x * 2), uint8(y * 2), 255})
		}
	}

	var imgBuf bytes.Buffer
	err := jpeg.Encode(&imgBuf, img, nil)
	if err != nil {
		panic(err)
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", `form-data; name="file"; filename="`+fileName+`"`)
	h.Set("Content-Type", "image/jpeg")

	part, err := writer.CreatePart(h)
	if err != nil {
		panic(err)
	}
	part.Write(imgBuf.Bytes())
	writer.Close()

	req := httptest.NewRequest("POST", "/", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	err = req.ParseMultipartForm(int64(body.Len()) + 1024)
	if err != nil {
		panic(err)
	}

	return req.MultipartForm.File["file"][0]
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

func TestUploadImage_ConcurrentSuccess(t *testing.T) {
	mockImageRepo := new(MockImageRepo)
	mockRedis := new(MockRedisClient)

	svc := &ImageService{
		storage:  &repository.Storage{Image: mockImageRepo, Path: "/mock/path"},
		redis:    mockRedis,
		validate: validator.New(),
	}

	numFiles := 30
	files := make([]*multipart.FileHeader, 0, numFiles)

	for i := 0; i < numFiles; i++ {
		file := createValidJPEGFileHeader(fmt.Sprintf("image%d.jpg", i))
		files = append(files, file)
	}

	mockImageRepo.
		On("Upload", mock.Anything, mock.AnythingOfType("*model.Image")).
		Run(func(args mock.Arguments) {
			img := args.Get(1).(*model.Image)
			img.ID = "some-id"
		}).
		Return(&model.Image{ID: "some-id"}, nil)

	// Mock Redis Set and Del
	mockRedis.On("Set", mock.MatchedBy(func(key string) bool {
		return strings.HasPrefix(key, "image:album1:")
	}), mock.AnythingOfType("string")).Times(numFiles)

	mockRedis.On("Del", "album_album1").Return()

	images, err := svc.UploadImage("album1", files)
	assert.NoError(t, err)
	assert.Len(t, images, numFiles)
	mockImageRepo.AssertExpectations(t)
	mockRedis.AssertExpectations(t)
}

package service

import (
	"image-service/internal/config/cache"
	"image-service/internal/model"
	"image-service/internal/repository"
	"mime/multipart"
)

type Service struct {
	storage      *repository.Storage
	AlbumService interface {
		GetAlbumsPreview() ([]*model.AlbumPreview, error)
		GetAlbum(string) (*model.Album, error)
		CreateAlbum(*model.AlbumPreview) (*model.AlbumPreview, error)
		UpdateAlbum(string, *model.AlbumPreview) (*model.AlbumPreview, error)
		DeleteAlbum(string) error
	}
	ImageService interface {
		UploadImage(string, []*multipart.FileHeader) ([]*model.Image, error)
		DeleteImage(string, string) error
		ServeImage(string, string) (string, error)
	}
	CacheService interface {
		ClearCache() error
	}
}

func NewService(storage *repository.Storage, redis *cache.RedisClient) *Service {
	return &Service{
		storage:      storage,
		AlbumService: &AlbumService{storage: storage, redis: redis},
		ImageService: &ImageService{storage: storage, redis: redis},
		CacheService: &CacheService{redis: redis},
	}
}

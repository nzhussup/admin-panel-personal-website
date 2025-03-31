package service

import (
	"fmt"
	"image-service/internal/config/cache"
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/repository"
	"strings"
	"time"
)

type AlbumService struct {
	storage *repository.Storage
	redis   *cache.RedisClient
}

func (s *AlbumService) GetAlbum(id string) (*model.Album, error) {
	var cachedAlbum *model.Album
	err := s.redis.Get(fmt.Sprintf("album_%s", id), &cachedAlbum)
	if err == nil {
		return cachedAlbum, nil
	}

	time.Sleep(30 * time.Second)

	album, err := s.storage.Album.Get(id)
	if err != nil {
		return nil, err
	}

	s.redis.Set(fmt.Sprintf("album_%s", id), album)
	return album, nil
}

func (s *AlbumService) GetAlbumsPreview() ([]*model.AlbumPreview, error) {

	var cachedPreview []*model.AlbumPreview
	err := s.redis.Get("albums_preview", &cachedPreview)
	if err == nil {
		return cachedPreview, nil
	}

	time.Sleep(30 * time.Second)

	albums, err := s.storage.Album.GetPreview()
	if err != nil {
		return nil, err
	}

	s.redis.Set("albums_preview", albums)

	return albums, nil
}

func (s *AlbumService) CreateAlbum(album *model.AlbumPreview) (*model.AlbumPreview, error) {
	album.Title = strings.TrimSpace(album.Title)
	album.Desc = strings.TrimSpace(album.Desc)

	if album.Title == "" {
		return nil, custom_errors.NewBadRequestError("title is required")
	}
	createdAlbum, err := s.storage.Album.Create(album)
	if err != nil {
		return nil, err
	}

	s.redis.Del("albums_preview")

	return createdAlbum, nil
}

func (s *AlbumService) DeleteAlbum(id string) error {

	s.redis.Del(fmt.Sprintf("album_%s", id))
	s.redis.Del("albums_preview")

	err := s.storage.Album.Delete(id)
	if err != nil {
		return err
	}

	return nil
}

func (s *AlbumService) UpdateAlbum(id string, album *model.AlbumPreview) (*model.AlbumPreview, error) {
	album.Title = strings.TrimSpace(album.Title)
	album.Desc = strings.TrimSpace(album.Desc)

	if album.Title == "" {
		return nil, custom_errors.NewBadRequestError("title is required")
	}
	updatedAlbum, err := s.storage.Album.Update(id, album)
	if err != nil {
		return nil, err
	}

	s.redis.Del(fmt.Sprintf("album_%s", id))
	s.redis.Del("albums_preview")

	return updatedAlbum, nil
}

package service

import (
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/repository"
	"strings"
)

type AlbumService struct {
	storage *repository.Storage
}

func (s *AlbumService) GetAlbum(id string) (*model.Album, error) {
	albums, err := s.storage.Album.Get(id)
	if err != nil {
		return nil, err
	}

	return albums, nil
}

func (s *AlbumService) GetAlbumsPreview() ([]*model.AlbumPreview, error) {
	albums, err := s.storage.Album.GetPreview()
	if err != nil {
		return nil, err
	}

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

	return createdAlbum, nil
}

func (s *AlbumService) DeleteAlbum(id string) error {
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
	return updatedAlbum, nil
}

package repository

import (
	"fmt"
	custom_errors "image-service/internal/errors"
	"image-service/internal/model"
	"image-service/internal/utils"
	"os"
	"path/filepath"
	"strings"
)

type AlbumRepository struct {
	Path        string
	ApiBasePath string
}

func (a *AlbumRepository) Create(m *model.AlbumPreview) (*model.AlbumPreview, error) {
	albumID := utils.GenerateUUID()
	albumPath := filepath.Join(a.Path, albumID)

	if _, err := os.Stat(albumPath); err == nil {
		return nil, custom_errors.NewConflictError("album already exists")
	}

	err := os.MkdirAll(albumPath, os.ModePerm)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to create album")
	}

	metaFilePath := filepath.Join(albumPath, "meta.txt")
	metaFile, err := os.Create(metaFilePath)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to create metadata file")
	}
	defer metaFile.Close()

	_, err = metaFile.WriteString(fmt.Sprintf("Title: %s\nDescription: %s\nDate: %s\nImageCount: 0\n", m.Title, m.Desc, m.Date))
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to write metadata file")
	}
	m.ID = albumID

	return m, nil
}

func (a *AlbumRepository) Get(id string) (*model.Album, error) {
	dirs, err := os.ReadDir(a.Path)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to read storage path")
	}

	for _, dir := range dirs {
		if dir.Name() == id {
			metaFilePath := filepath.Join(a.Path, id, "meta.txt")
			metaFileContent, err := os.ReadFile(metaFilePath)
			if err != nil {
				return nil, custom_errors.NewInternalServerError("failed to read metadata file")
			}

			album := &model.Album{
				ID:    id,
				Title: strings.Split(strings.Split(string(metaFileContent), "\n")[0], ": ")[1],
				Desc:  strings.Split(strings.Split(string(metaFileContent), "\n")[1], ": ")[1],
				Date:  strings.Split(strings.Split(string(metaFileContent), "\n")[2], ": ")[1],
			}

			albumPath := filepath.Join(a.Path, id)
			files, err := os.ReadDir(albumPath)
			if err != nil {
				return nil, custom_errors.NewBadRequestError("failed to read album directory")
			}

			var images []*model.Image
			for _, file := range files {
				if file.IsDir() || !utils.IsImageFile(file.Name()) {
					continue
				}

				imageURL := fmt.Sprintf("%s/%s/%s", a.ApiBasePath, id, file.Name())

				image := &model.Image{
					ID:   file.Name(),
					Type: utils.DetermineImageType(file.Name()),
					Data: nil,
					URL:  imageURL,
				}
				images = append(images, image)
			}

			album.Images = images
			return album, nil
		}
	}
	return nil, custom_errors.NewNotFoundError("album not found")
}

func (a *AlbumRepository) GetPreview() ([]*model.AlbumPreview, error) {
	dirs, err := os.ReadDir(a.Path)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to read storage path")
	}

	var albumPreviews []*model.AlbumPreview

	for _, dir := range dirs {
		if dir.IsDir() {
			metaFilePath := filepath.Join(a.Path, dir.Name(), "meta.txt")

			metaFileContent, err := os.ReadFile(metaFilePath)
			if err != nil {
				return nil, custom_errors.NewInternalServerError("failed to read metadata file")
			}

			imageCount, err := utils.GetImageCount(metaFilePath)
			if err != nil {
				return nil, custom_errors.NewInternalServerError("failed to get image count")
			}

			album := &model.AlbumPreview{
				ID:         dir.Name(),
				Title:      strings.Split(strings.Split(string(metaFileContent), "\n")[0], ": ")[1],
				Desc:       strings.Split(strings.Split(string(metaFileContent), "\n")[1], ": ")[1],
				Date:       strings.Split(strings.Split(string(metaFileContent), "\n")[2], ": ")[1],
				ImageCount: imageCount,
			}

			albumPreviews = append(albumPreviews, album)
		}
	}
	return albumPreviews, nil
}

func (a *AlbumRepository) Delete(id string) error {
	albumPath := filepath.Join(a.Path, id)
	if _, err := os.Stat(albumPath); os.IsNotExist(err) {
		return custom_errors.NewNotFoundError("album not found")
	}
	err := os.RemoveAll(albumPath)
	if err != nil {
		return custom_errors.NewInternalServerError("failed to delete album")
	}

	return nil
}

func (a *AlbumRepository) Update(id string, m *model.AlbumPreview) (*model.AlbumPreview, error) {
	albumPath := filepath.Join(a.Path, id)
	if _, err := os.Stat(albumPath); os.IsNotExist(err) {
		return nil, custom_errors.NewNotFoundError("album not found")
	}

	metaFilePath := filepath.Join(albumPath, "meta.txt")
	var imageCount int
	if _, err := os.Stat(metaFilePath); err == nil {
		imageCount, err = utils.GetImageCount(metaFilePath)
		if err != nil {
			return nil, custom_errors.NewInternalServerError("failed to get image count")
		}
		os.Remove(metaFilePath)
	}

	metaFile, err := os.Create(metaFilePath)
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to create metadata file")
	}
	defer metaFile.Close()

	_, err = metaFile.WriteString(fmt.Sprintf("Title: %s\nDescription: %s\nDate: %s\nImageCount: %d\n", m.Title, m.Desc, m.Date, imageCount))
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to write metadata file")
	}

	m.ID = id
	return m, nil
}

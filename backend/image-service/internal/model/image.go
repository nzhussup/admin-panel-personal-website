package model

type ImageType string

const (
	JPEG ImageType = "image/jpeg"
	JPG  ImageType = "image/jpg"
	PNG  ImageType = "image/png"
)

type Image struct {
	ID   string    `json:"id"`
	Type ImageType `json:"type"`
	Data []byte    `json:"data"`
	URL  string    `json:"url"`
}

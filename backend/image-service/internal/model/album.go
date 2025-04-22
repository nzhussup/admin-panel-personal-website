package model

type AlbumType string

const (
	Private    AlbumType = "private"
	SemiPublic AlbumType = "semi-public"
	Public     AlbumType = "public"
)

func (t AlbumType) IsValid() bool {
	switch t {
	case Private, SemiPublic, Public:
		return true
	}
	return false
}

type Album struct {
	ID     string    `json:"id"`
	Title  string    `json:"title"`
	Desc   string    `json:"desc"`
	Date   string    `json:"date"`
	Type   AlbumType `json:"type"`
	Images []*Image  `json:"images"`
}

type AlbumPreview struct {
	ID              string    `json:"id"`
	Title           string    `json:"title"`
	Desc            string    `json:"desc"`
	Date            string    `json:"date"`
	ImageCount      int       `json:"image_count"`
	Type            AlbumType `json:"type"`
	PreviewImageURL string    `json:"preview_image"`
}

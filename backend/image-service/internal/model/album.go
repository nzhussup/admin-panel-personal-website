package model

type Album struct {
	ID     string   `json:"id"`
	Title  string   `json:"title"`
	Desc   string   `json:"desc"`
	Date   string   `json:"date"`
	Images []*Image `json:"images"`
}

type AlbumPreview struct {
	ID         string `json:"id"`
	Title      string `json:"title"`
	Desc       string `json:"desc"`
	Date       string `json:"date"`
	ImageCount int    `json:"image_count"`
}

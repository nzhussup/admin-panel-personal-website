package utils

import (
	"bytes"
	"image"
	custom_errors "image-service/internal/errors"
	"image/jpeg"
	"image/png"

	"github.com/adrium/goheif"
	"github.com/nfnt/resize"
)

func CompressImage(data []byte, extension string) ([]byte, error) {
	if extension == "heic" {
		convertedData, err := ConvertHEICToJPEG(data)
		if err != nil {
			return nil, err
		}
		data = convertedData
		extension = "jpeg"
	}

	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to decode image")
	}

	compressedImage := resize.Resize(800, 0, img, resize.Lanczos3)

	var buf bytes.Buffer

	switch extension {
	case "jpeg", "jpg":
		err = jpeg.Encode(&buf, compressedImage, &jpeg.Options{Quality: 80})
	case "png":
		err = png.Encode(&buf, compressedImage)
	default:
		return nil, custom_errors.NewBadRequestError("invalid image type. only jpeg and png are allowed")
	}

	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to encode image while compressing")
	}

	return buf.Bytes(), nil
}

func ConvertHEICToJPEG(data []byte) ([]byte, error) {
	img, err := goheif.Decode(bytes.NewReader(data))
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to decode HEIC image")
	}

	var buf bytes.Buffer
	err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 100})
	if err != nil {
		return nil, custom_errors.NewInternalServerError("failed to encode image while converting HEIC to JPEG")
	}

	return buf.Bytes(), nil
}

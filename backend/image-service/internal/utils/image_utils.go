package utils

import (
	"bytes"
	"image"
	custom_errors "image-service/internal/errors"
	"image/jpeg"
	"image/png"
	"os"
	"strconv"
	"strings"

	"sync"

	"github.com/adrium/goheif"
	"github.com/nfnt/resize"
)

var MetadataMutex sync.Mutex

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

func GetImageCount(metaDataPath string) (int, error) {
	content, err := os.ReadFile(metaDataPath)
	if err != nil {
		return 0, custom_errors.NewInternalServerError("failed to read metadata file")
	}
	countString := strings.Split(strings.Split(string(content), "\n")[3], ": ")[1]
	count, err := strconv.Atoi(countString)
	if err != nil {
		return 0, custom_errors.NewInternalServerError("failed to parse image count")
	}
	return count, nil
}

func IncrementImageCount(metaDataPath string, n int) error {
	MetadataMutex.Lock()
	defer MetadataMutex.Unlock()

	content, err := os.ReadFile(metaDataPath)
	if err != nil {
		return custom_errors.NewInternalServerError("failed to read metadata file")
	}

	lines := strings.Split(string(content), "\n")

	countLine := lines[3]
	parts := strings.Split(countLine, ": ")
	if len(parts) != 2 {
		return custom_errors.NewInternalServerError("invalid count line format")
	}

	count, err := strconv.Atoi(parts[1])
	if err != nil {
		return custom_errors.NewInternalServerError("failed to parse image count")
	}

	count += n
	lines[3] = parts[0] + ": " + strconv.Itoa(count)

	err = os.WriteFile(metaDataPath, []byte(strings.Join(lines, "\n")), os.ModePerm)
	if err != nil {
		return custom_errors.NewInternalServerError("failed to write metadata file")
	}

	return nil
}

func DecrementImageCount(metaDataPath string, n int) error {
	MetadataMutex.Lock()
	defer MetadataMutex.Unlock()

	content, err := os.ReadFile(metaDataPath)
	if err != nil {
		return custom_errors.NewInternalServerError("failed to read metadata file")
	}

	lines := strings.Split(string(content), "\n")

	countLine := lines[3]
	parts := strings.Split(countLine, ": ")
	if len(parts) != 2 {
		return custom_errors.NewInternalServerError("invalid count line format")
	}

	count, err := strconv.Atoi(parts[1])
	if err != nil {
		return custom_errors.NewInternalServerError("failed to parse image count")
	}

	count -= n
	if count < 0 {
		count = 0
	}
	lines[3] = parts[0] + ": " + strconv.Itoa(count)

	err = os.WriteFile(metaDataPath, []byte(strings.Join(lines, "\n")), os.ModePerm)
	if err != nil {
		return custom_errors.NewInternalServerError("failed to write metadata file")
	}

	return nil
}

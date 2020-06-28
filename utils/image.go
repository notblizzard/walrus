package utils

import (
	"fmt"
	"image"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
)

// MakeThumbnail make image thumbnail
func MakeThumbnail(folder, path string) string {
	pathExt := filepath.Ext(path)
	pathNoBase := strings.TrimSuffix(path, pathExt)

	thumbnailPath := fmt.Sprintf("%s-thumbnail%s", pathNoBase, pathExt)

	file, err := os.Open(fmt.Sprintf("%s/%s", folder, path))
	if err != nil {
		panic(err)
	}
	defer file.Close()

	image, _, err := image.Decode(file)
	if err != nil {
		panic(err)
	}
	thumbnail := imaging.Fill(image, 150, 150, imaging.Center, imaging.Lanczos)
	err = imaging.Save(thumbnail, fmt.Sprintf("uploads/%s", thumbnailPath))

	if err != nil {
		panic(err)
	}

	return thumbnailPath
}

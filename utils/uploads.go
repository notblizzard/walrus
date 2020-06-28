package utils

import "os"

// MkUploadDir create uploads and avatars directories
func MkUploadDir() {
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0700)
	}

	if _, err := os.Stat("avatars"); os.IsNotExist(err) {
		os.Mkdir("avatars", 0700)
	}

}

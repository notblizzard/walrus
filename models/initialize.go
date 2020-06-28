package models

import (
	"fmt"
	"os"

	"github.com/jinzhu/gorm"
)

var DB *gorm.DB

// InitializeModels
func InitializeDB() {
	psql := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_NAME"), os.Getenv("DB_PASS"))
	DB, _ = gorm.Open("postgres", psql)

	DB.AutoMigrate(
		&User{},
		&Image{},
		&Comment{},
		&Image{},
		&Album{},
		&Post{},
		&Like{},
	)
}

func CloseDB() error {
	return DB.Close()
}

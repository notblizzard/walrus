package models

import "time"

// Image model
type Image struct {
	ID            uint       `json:"id" gorm:"primary_key" `
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `json:"deletedAt"`
	Path          string     `json:"path"`
	ThumbnailPath string     `json:"thumbnailPath"`
	UserID        uint       `json:"userId"`
	User          User       `json:"user"`
	Comments      []Comment  `json:"comments"`
	Title         string     `json:"title"`
	AlbumID       uint       `json:"albumId"`
	Album         Album      `json:"album"`
	ImageID       string     `json:"imageId" gorm:"unique"`
	Description   string     `json:"description"`
	Post          Post       `json:"post"`
	PostID        uint       `json:"postId"`
}

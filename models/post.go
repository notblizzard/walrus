package models

import "time"

// Post model
type Post struct {
	ID        uint       `json:"id" gorm:"primary_key" `
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
	UserID    uint       `json:"userId"`
	User      User       `json:"user"`
	Title     string     `json:"title"`
	Images    []Image    `json:"images"`
	Comments  []Comment  `json:"comments"`
	AlbumID   uint       `json:"albumId"`
	ImageID   uint       `json:"imageId"`
	Likes     []Like     `json:"likes"`
}

package models

import "time"

// Image model
type Album struct {
	ID        uint       `json:"id" gorm:"primary_key" `
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
	UserID    uint       `json:"userId"`
	User      User       `json:"user"`
	Title     string     `json:"title"`
	Images    []Image    `json:"images"`
	Comments  []Comment  `json:"comments"`
	Post      Post       `json:"post"`
	PostID    uint       `json:"postId"`
}

package models

import "time"

// Image model
type Comment struct {
	ID        uint       `json:"id" gorm:"primary_key" `
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
	Data      string     `json:"data"`
	UserID    uint       `json:"userId"`
	User      User       `json:"user"`
	Post      Post       `json:"post"`
	PostID    uint       `json:"postId"`
}

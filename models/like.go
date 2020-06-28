package models

import "time"

// Like model
type Like struct {
	ID        uint       `json:"id" gorm:"primary_key" `
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
	User      User       `json:"user"`
	UserID    uint       `json:"userId"`
	Post      Post       `json:"post"`
	PostID    uint       `json:"postId" gorm:"unique"`
}

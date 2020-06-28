package models

import "time"

// User model
type User struct {
	ID         uint       `gorm:"primary_key" json:"id"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
	DeletedAt  *time.Time `json:"deletedAt"`
	Username   string     `json:"username"`
	Password   string     `json:"password"`
	Email      string     `json:"email"`
	GithubID   string     `json:"githubId"`
	Images     []Image    `json:"images"`
	Comments   []Comment  `json:"comments"`
	Albums     []Album    `json:"albums"`
	Likes      []Like     `json:"likes"`
	AvatarPath string     `json:"avatarPath"`
}

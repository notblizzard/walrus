package routes

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/notblizzard/walrus/models"
)

// User struct
type User struct {
	Username string `json:"username" binding:"required,min=2"`
	Email    string `json:"email" binding:"required,email"`
	Gravatar bool   `json:"gravatar"`
}

// StringToMD5 convert string to md5
func StringToMD5(str string) string {
	hash := md5.New()
	hash.Write([]byte(str))
	avatar := fmt.Sprintf("https://www.gravatar.com/avatar/%s?size=200", hex.EncodeToString(hash.Sum(nil)))
	return avatar
}

// ViewUserSettings view user settings route
func ViewUserSettings(c *gin.Context) {
	userID := c.MustGet("user_id")

	var user models.User

	models.DB.First(&user, userID)
	c.JSON(http.StatusOK, gin.H{"success": true, "user": user})
}

// UpdateUserSettings update user settings route
func UpdateUserSettings(c *gin.Context) {
	var json User

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("user_id")

	var user models.User

	models.DB.First(&user, userID)

	user.Username = json.Username
	user.Email = json.Email
	if json.Gravatar == true {
		user.AvatarPath = StringToMD5(user.Email)
	} else {
		user.AvatarPath = fmt.Sprintf("%s.png", user.Username)
	}

	models.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"success": true, "user": user})
}

// ViewUser view user route
func ViewUser(c *gin.Context) {
	userID := c.MustGet("user_id")

	var user models.User

	/*	models.DB.First(&user, userID.(uint))
		models.DB.Model(&user).Association("Images").Find(&user.Images)
		models.DB.Model(&user).Association("Albums").Find(&user.Albums)
		models.DB.Model(&user).Association("Albums.Image")
	*/
	models.DB.Preload("Images").Preload("Images.Album").Preload("Albums").Preload("Albums.Images").First(&user, userID)
	sort.Slice(user.Images, func(i, j int) bool {
		return user.Images[i].CreatedAt.After(user.Images[j].CreatedAt)
	})
	c.JSON(http.StatusOK, gin.H{"success": true, "user": user})
}

// ImagesUser get images
func ImagesUser(c *gin.Context) {
	var images []models.Image
	userID := c.MustGet("user_id")

	models.DB.Where(models.Image{UserID: userID.(uint)}).Find(&images)

	sort.Slice(images, func(i, j int) bool {
		return images[i].CreatedAt.Before(images[j].CreatedAt)
	})

	c.JSON(http.StatusOK, gin.H{"success": true, "images": images})
}

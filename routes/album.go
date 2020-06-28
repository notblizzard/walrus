package routes

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/notblizzard/walrus/models"
)

// AddImagesToAlbum struct to parse UpdateAlbum route
type AddImagesToAlbum struct {
	ID       uint   `json:"id"`
	ImageIDs []uint `json:"imageIds"`
	AlbumID  uint   `json:"albumId"`
}

// Album struct to parse ViewAlbum route
type Album struct {
	ID      uint   `json:"id" binding:"required"`
	Title   string `json:"title" binding:"required"`
	Private bool   `json:"private"`
}

// MakeAlbum struct to parse CreateAlbum route
type MakeAlbum struct {
	Title string `json:"title" binding:"required"`
}

// RemoveAlbum struct to parse DeleteAlbum route
type RemoveAlbum struct {
	ID uint `json:"id" binding:"required"`
}

// NewAlbum new album route
func NewAlbum(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	var json MakeAlbum

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	album := models.Album{Title: json.Title, UserID: userID}

	if len(strings.TrimSpace(json.Title)) == 0 {
		album.Title = randomAlphanumeric(8)
	}

	models.DB.Save(&album)
	c.JSON(http.StatusOK, gin.H{"success": true, "album": album})
}

// ViewAlbum view album route
func ViewAlbum(c *gin.Context) {
	var album models.Album

	albumID := c.Param("id")

	models.DB.Preload("Images").First(&album, albumID)

	c.JSON(http.StatusOK, gin.H{"success": true, "album": album})
}

// DeleteAlbum delete album route
func DeleteAlbum(c *gin.Context) {
	var json RemoveAlbum
	var album models.Album

	userID := c.MustGet("user_id").(uint)

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Where(&models.Album{ID: json.ID, UserID: userID}).Delete(&album)
	c.JSON(http.StatusOK, gin.H{"success": true, "deleted": true})

}

// UpdateAlbum update album title route
func UpdateAlbum(c *gin.Context) {
	var json Album
	var album models.Album

	userID := c.MustGet("user_id").(uint)

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Where(&models.Album{ID: json.ID, UserID: userID}).First(&album)
	album.Title = json.Title

	models.DB.Save(&album)
	c.JSON(http.StatusOK, gin.H{"success": true, "album": album})

}

// UpdateAlbumWithImages update album with images route
func UpdateAlbumWithImages(c *gin.Context) {
	var json AddImagesToAlbum

	var album models.Album

	var images []models.Image

	userID := c.MustGet("user_id").(uint)

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Where(&models.Album{ID: json.ID, UserID: userID}).First(&album)
	models.DB.Model(&models.Image{}).Where("id NOT IN (?)", json.ImageIDs).Update("album_id", nil)
	models.DB.Preload("Album").Model(&models.Image{}).Where("id IN (?)", json.ImageIDs).Update("album_id", album.ID).Find(&images)

	c.JSON(http.StatusOK, gin.H{"success": true})

}

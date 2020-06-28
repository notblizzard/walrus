package routes

import (
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/notblizzard/walrus/models"
)

// MakePost make post
type MakePost struct {
	ID uint `json:"id"`
}

// ListPost list all posts route
func ListPost(c *gin.Context) {
	var posts []models.Post

	models.DB.Preload("Images").Find(&posts)

	c.JSON(http.StatusOK, gin.H{"success": true, "posts": posts})
}

// NewPostImage make new post route
func NewPostImage(c *gin.Context) {
	var image models.Image
	var json MakePost
	var post models.Post

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.First(&image, json.ID)

	models.DB.First(&post, models.Post{ImageID: image.ID})

	if post.ID == 0 {
		post.Images = append(post.Images, image)
		post.Title = image.Title
		post.ImageID = image.ID
		models.DB.Save(&post)

		image.PostID = post.ID
		models.DB.Save(&image)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "post already exists"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "post": post})
}

// ViewPost view post route
func ViewPost(c *gin.Context) {
	var post models.Post

	postID := c.Param("id")

	//models.DB.First(&post, postID)

	models.DB.Preload("Images").Preload("Comments").Preload("Comments.User").First(&post, postID)

	// order comments, so latest comment is at the bottom
	sort.Slice(post.Comments, func(i, j int) bool {
		return post.Comments[i].CreatedAt.After(post.Comments[j].CreatedAt)
	})

	c.JSON(http.StatusOK, gin.H{"success": true, "post": post})

}

// ViewPostAlbum view post album route
func ViewPostAlbum(c *gin.Context) {
	var album models.Album

	albumID := c.Param("id")

	models.DB.First(&album, albumID)

	models.DB.Preload("User").Preload("Comments").Preload("Comments.User").First(&album, albumID)

	// order comments, so latest comment is at the bottom
	sort.Slice(album.Comments, func(i, j int) bool {
		return album.Comments[i].ID < album.Comments[j].ID
	})

	c.JSON(http.StatusOK, gin.H{"success": true, "album": album})
}

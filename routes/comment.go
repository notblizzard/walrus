package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/notblizzard/walrus/models"
)

// Comment struct for NewComment route
type Comment struct {
	Data   string `json:"data" binding:"required"`
	PostID uint   `json:"postId" binding:"required"`
}

// NewComment create new comment
func NewComment(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var json Comment
	//var user models.User
	var post models.Post
	// verify that image exists

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.First(&post, json.PostID)

	comment := models.Comment{Data: json.Data, UserID: userID, PostID: json.PostID} //, ImageID: image.ID}
	models.DB.Create(&comment)

	models.DB.Preload("User").First(&comment, comment.ID)

	c.JSON(http.StatusOK, gin.H{"success": true, "comment": comment})

}

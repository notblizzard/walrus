package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/notblizzard/walrus/models"
)

// MakeLike struct for Like route
type MakeLike struct {
	PostID uint `json:"postId" binding:"required"`
}

// Like toggle like route
func Like(c *gin.Context) {
	var like models.Like
	var json MakeLike

	userID := c.MustGet("user_id").(uint)

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.First(&like, models.Like{UserID: userID, PostID: json.PostID})

	if like.ID == 0 {
		like.UserID = userID
		like.PostID = json.PostID
		models.DB.Save(&like)

		c.JSON(http.StatusOK, gin.H{"success": true, "liked": true})
	} else {
		models.DB.Unscoped().Delete(&like)
		c.JSON(http.StatusOK, gin.H{"success": true, "liked": false})

	}
}

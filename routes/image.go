package routes

import (
	"crypto/rand"
	"fmt"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
	"github.com/notblizzard/walrus/models"
	"github.com/notblizzard/walrus/utils"
)

// Image struct
type Image struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Private     bool   `json:"private"`
	Description string `json:"description"`
}

// RemoveImages struct
type RemoveImages struct {
	ImageIDs []uint `json:"ids"`
}

func randomAlphanumeric(n int) string {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	s := fmt.Sprintf("%X", b)
	return s
}

// NewImageAvatar upload new image that will be used for the user's avatar
func NewImageAvatar(c *gin.Context) {
	form, _ := c.MultipartForm()
	file := form.File["image"][0]
	var user models.User

	userID := c.MustGet("user_id").(uint)

	models.DB.First(&user, userID)

	filePath := fmt.Sprintf("%s%s", user.Username, ".png")
	if err := c.SaveUploadedFile(file, path.Join("avatars", filePath)); err == nil {

		user.AvatarPath = filePath
		models.DB.Save(&user)

		c.SetCookie(
			"avatar",
			user.AvatarPath,
			60*60*24*7,
			"/",
			"localhost",
			false,
			false,
		)

		c.JSON(http.StatusOK, gin.H{"success": true, "avatar": filePath})
	}
}

// NewImage upload new image
func NewImage(c *gin.Context) {

	err := csrf.FailureReason(c.Request)
	if err != nil {
		panic(err)
	}

	form, _ := c.MultipartForm()
	files := form.File["images[]"]
	var images []models.Image
	var album models.Album
	i := make(chan models.Image)

	userID := c.MustGet("user_id").(uint)
	if len(files) > 1 {
		album = models.Album{UserID: userID}
		models.DB.Create(&album)
	}

	for _, file := range files {
		go func() {
			fileExt := filepath.Ext(file.Filename)
			fileName := randomAlphanumeric(7)
			filePath := fmt.Sprintf("%s%s", fileName, fileExt)
			if err := c.SaveUploadedFile(file, path.Join("uploads", filePath)); err == nil {
				thumbnailPath := utils.MakeThumbnail("uploads", filePath)
				var image models.Image

				if len(files) >= 1 {
					image = models.Image{Path: filePath, UserID: userID, ThumbnailPath: thumbnailPath, AlbumID: album.ID, ImageID: fileName}
				} else {
					image = models.Image{Path: filePath, UserID: userID, ThumbnailPath: thumbnailPath, ImageID: fileName}
				}

				models.DB.Create(&image)
				i <- image
			}
		}()
		images = append(images, <-i)
	}

	if len(files) > 1 {
		album.Title = images[0].ImageID
		models.DB.Save(&album)
		c.JSON(http.StatusOK, gin.H{"success": true, "images": images, "album": album})

	} else {
		c.JSON(http.StatusOK, gin.H{"success": true, "images": images})
	}
	return

}

// UpdateImage update image
func UpdateImage(c *gin.Context) {
	var image models.Image
	var json Image

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("user_id").(uint)
	models.DB.First(&image, models.Image{ID: json.ID, UserID: userID})
	image.Title = json.Title
	image.Description = json.Description
	models.DB.Save(&image)
	c.JSON(http.StatusOK, gin.H{"success": true, "image": image})
	return

}

// DeleteImages route to delete images
func DeleteImages(c *gin.Context) {
	var json RemoveImages
	var images []models.Image
	var imageIDs []uint
	userID := c.MustGet("user_id").(uint)

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Where("id IN (?) AND user_id = ?", json.ImageIDs, userID).Find(&images)

	for i := range images {
		imageIDs = append(imageIDs, images[i].ID)

		go func(i int) {
			os.Remove(path.Join("uploads", images[i].Path))
			os.Remove(path.Join("uploads", images[i].ThumbnailPath))
		}(i)

	}

	models.DB.Delete(models.Image{}, "id IN (?)", imageIDs)

	c.JSON(http.StatusOK, gin.H{"success": true, "images": imageIDs})

}

// ViewImage view image
func ViewImage(c *gin.Context) {
	var image models.Image

	imageID := c.Param("id")

	models.DB.First(&image, imageID)

	c.JSON(http.StatusOK, gin.H{"success": true, "image": image})
}

package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
	"github.com/notblizzard/walrus/utils"
)

// InitializeStatic initialize static
func InitializeStatic(r *gin.Engine) {
	r.Static("/static", "./static")
	r.Static("/i", "./uploads")
	r.Static("/avatar", "./avatars")
	r.LoadHTMLGlob("templates/*")
}

// InitializeRoutes initialize routes
func InitializeRoutes(r *gin.Engine) {

	public := r.Group("/api")

	auth := r.Group("/api")
	auth.Use(utils.JWTMiddleware)

	public.POST("/register", RegisterUser)
	public.POST("/login", LoginUser)
	public.GET("/logout", LogoutUser)

	public.GET("/auth/github", GithubOAuth)
	public.GET("/auth/github/callback", GithubOAuthCallback)

	public.GET("/posts", ListPost)
	public.GET("/post/:id", ViewPost)
	public.GET("/image/:id", ViewImage)
	public.GET("/album/:id", ViewAlbum)

	auth.POST("/like", Like)

	auth.POST("/post/image/new", NewPostImage)
	auth.POST("/image/update", UpdateImage)
	auth.POST("/album/new", NewAlbum)
	auth.POST("/album/update", UpdateAlbum)
	auth.POST("/album/add-images", UpdateAlbumWithImages)
	auth.POST("/album/delete-album", DeleteAlbum)

	auth.POST("/image/delete-images", DeleteImages)
	auth.POST("/comment/new", NewComment)
	auth.GET("/user", ViewUser)
	auth.GET("/user/settings", ViewUserSettings)
	auth.POST("/user/settings", UpdateUserSettings)
	auth.GET("/user/images", ImagesUser)
	auth.POST("/upload", NewImage)
	auth.POST("/upload-avatar", NewImageAvatar)

	r.NoRoute(func(c *gin.Context) {
		c.SetCookie(
			"X-CSRF-TOKEN",
			csrf.Token(c.Request),
			60*60*24*7,
			"/",
			"",
			false,
			false,
		)
		c.HTML(http.StatusOK, "home.html", gin.H{})
	})
}

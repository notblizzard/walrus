package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/markbates/goth/gothic"
	"github.com/notblizzard/walrus/models"
	"github.com/notblizzard/walrus/utils"
	"golang.org/x/crypto/bcrypt"
)

// Register struct for RegisterUser route
type Register struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

// Login struct for LoginUser route
type Login struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func setProvider(c *gin.Context, provider string) {
	query := c.Request.URL.Query()
	query.Add("provider", provider)
	c.Request.URL.RawQuery = query.Encode()
}

// LogoutUser route to logout user
func LogoutUser(c *gin.Context) {
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.SetCookie("avatar", "", -1, "/", "", false, false)
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// LoginUser route to login user
func LoginUser(c *gin.Context) {
	var json Login

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	models.DB.Where("username ILIKE ?", json.Username).First(&user)

	if user.Username != "" {
		// user is found
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(json.Password))
		if err == nil {
			// correct password
			token := utils.GenToken(user.ID)
			c.SetSameSite(http.SameSiteStrictMode)
			c.SetCookie(
				"token",
				token,
				60*60*24*7,
				"/",
				"",
				false,
				true,
			)
			c.SetCookie(
				"avatar",
				user.AvatarPath,
				60*60*24*7,
				"/",
				"",
				false,
				false,
			)
			c.JSON(http.StatusOK, map[string]interface{}{"success": true})
		} else {
			c.JSON(http.StatusUnauthorized, map[string]interface{}{"success": false, "error": "wrong password"})
		}
	} else {
		c.JSON(http.StatusNotFound, map[string]interface{}{"success": false, "error": "user doesn't exist"})
	}
}

// RegisterUser route to register user.
func RegisterUser(c *gin.Context) {
	var json Register

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	models.DB.Where(&models.User{Username: json.Username}).Or(&models.User{Email: json.Email}).First(&user)

	if user.Username == "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(json.Password), 10)
		if err != nil {
			panic(err)
		}
		gravatar := StringToMD5(json.Email)
		user = models.User{Username: json.Username, Email: json.Email, Password: string(hashed), AvatarPath: gravatar}
		models.DB.Create(&user)
		c.JSON(http.StatusOK, map[string]interface{}{"success": true})
	} else {
		c.JSON(http.StatusOK, map[string]interface{}{"success": false})
	}
}

// GithubOAuth login user using Github OAuth.
func GithubOAuth(c *gin.Context) {
	setProvider(c, "github")
	gothic.BeginAuthHandler(c.Writer, c.Request)
}

// GithubOAuthCallback callback to handle Github OAuth.
func GithubOAuthCallback(c *gin.Context) {
	setProvider(c, "github")
	oUser, err := gothic.CompleteUserAuth(c.Writer, c.Request)

	if err != nil {
		panic(err)
	}
	var user models.User

	models.DB.Where(models.User{GithubID: oUser.UserID}).Attrs(models.User{Username: oUser.NickName, Email: oUser.Email}).FirstOrCreate(&user)

	token := utils.GenToken(user.ID)

	c.SetCookie(
		"token",
		token,
		60*60*24*14,
		"/",
		"localhost",
		true,
		true,
	)

	c.Redirect(302, "/")
}

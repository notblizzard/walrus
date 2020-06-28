package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"github.com/notblizzard/walrus/models"
	"github.com/notblizzard/walrus/routes"
	"github.com/notblizzard/walrus/utils"
)

func main() {
	godotenv.Load()

	gin.SetMode(os.Getenv("GIN_MODE"))

	models.InitializeDB()
	defer models.CloseDB()

	utils.InitializeOauth()
	utils.MkUploadDir()

	CSRF := csrf.Protect([]byte(os.Getenv("JWT_SECRET_KEY")), csrf.Secure(false), csrf.HttpOnly(false))

	r := gin.Default()

	routes.InitializeStatic(r)
	routes.InitializeRoutes(r)

	http.ListenAndServe(fmt.Sprintf(":%s", os.Getenv("PORT")), CSRF(r))
}

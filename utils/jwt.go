package utils

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gopkg.in/dgrijalva/jwt-go.v3"
)

// GenToken generate JWT token
func GenToken(id uint) string {
	claims := jwt.MapClaims{}
	claims["user_id"] = id

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
	})
	token, err := at.SignedString([]byte(os.Getenv("JWT_SECRET_KEY")))

	if err != nil {
		panic(err)
	}
	return token
}

// JWTMiddleware Middleware for validating JWT token
func JWTMiddleware(c *gin.Context) {
	authToken, err := c.Cookie("token")

	if err != nil {
		panic(err)
	}

	token, err := jwt.Parse(authToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("error")
		}

		return []byte(os.Getenv("JWT_SECRET_KEY")), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		c.Set("user_id", uint(claims["id"].(float64)))
		c.Next()
	} else {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}
}

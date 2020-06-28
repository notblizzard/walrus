package utils

import (
	"os"

	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/github"
)

// GithubOAuth goth Github oauth
var GithubOAuth = github.New(os.Getenv("GITHUB_CLIENT_ID"), os.Getenv("GITHUB_CLIENT_SECRET"), "http://d8034d55225e.ngrok.io/auth/github/callback")

// InitializeOauth initialize ouath providers
func InitializeOauth() {
	goth.UseProviders(
		GithubOAuth,
	)
}

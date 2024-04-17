package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getAlbums(c *gin.Context) {
	var cocktails = []cocktail{{}}
	c.IndentedJSON(http.StatusOK, cocktails)
}

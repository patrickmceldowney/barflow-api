package controllers

import (
	"errors"
	"net/http"

	"barflow.app/api/database"
	"github.com/gin-gonic/gin"
)

func ReadCocktail(c *gin.Context) {
	var cocktail database.Cocktail
	id := c.Param("id")
	res := database.DB.Find(&cocktail, id)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "cocktail not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cocktail": "cocktail",
	})
	return
}

func ReadCocktails(c *gin.Context) {
	var cocktails []database.Cocktail

	res := database.DB.Find(&cocktails)

	if res.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": errors.New("cocktails not found"),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cocktails": cocktails,
	})
	return
}

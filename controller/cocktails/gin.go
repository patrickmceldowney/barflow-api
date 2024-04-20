package cocktails

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
}

// Create routes
func CreateCocktail(c *gin.Context) {
	var cocktail *database.Cocktail
	err := c.ShouldBind(&cocktail)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	res := database.DB.Create(cocktail)
	if res.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error creating cocktail",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cocktail": cocktail,
	})

}

// Update
func UpdateCocktail(c *gin.Context) {
	var cocktail database.Cocktail
	id := c.Param("id")
	err := c.ShouldBind(&cocktail)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	var updateCocktail database.Cocktail
	res := database.DB.Model(&updateCocktail).Where("id= ?", id).Updates(cocktail)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "could not update cocktail",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cocktail": cocktail,
	})
}

// Delete
func DeleteCocktail(c *gin.Context) {
	var cocktail database.Cocktail
	id := c.Param("id")
	res := database.DB.Find(&cocktail, id)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "cocktail not found",
		})
		return
	}

	database.DB.Delete(&cocktail)
	c.JSON(http.StatusOK, gin.H{
		"message": "cocktail successfully deleted",
	})
}

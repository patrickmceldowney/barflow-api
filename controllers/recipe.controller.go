package controllers

import (
	"errors"
	"net/http"

	"barflow.app/api/database"
	"barflow.app/api/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RecipeController struct {
	DB *gorm.DB
}

func NewRecipeController(DB *gorm.DB) RecipeController {
	return RecipeController{DB}
}

func ReadRecipe(c *gin.Context) {
	var recipe models.Recipe
	id := c.Param("id")
	res := database.DB.Find(&recipe, id)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "recipe not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recipe": "recipe",
	})
}

func ListRecipes(c *gin.Context) {
	var recipes []models.Recipe

	res := database.DB.Find(&recipes)

	if res.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": errors.New("recipes not found"),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recipes": recipes,
	})
}

// Create routes
func CreateRecipe(c *gin.Context) {
	var recipe *models.Recipe
	err := c.ShouldBind(&recipe)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	res := database.DB.Create(recipe)
	if res.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error creating recipe",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recipe": recipe,
	})

}

// Update
func UpdateRecipe(c *gin.Context) {
	var recipe models.Recipe
	id := c.Param("id")
	err := c.ShouldBind(&recipe)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	var updateRecipe models.Recipe
	res := database.DB.Model(&updateRecipe).Where("id= ?", id).Updates(recipe)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "could not update recipe",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recipe": recipe,
	})
}

// Delete
func DeleteRecipe(c *gin.Context) {
	var recipe models.Recipe
	id := c.Param("id")
	res := database.DB.Find(&recipe, id)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "recipe not found",
		})
		return
	}

	database.DB.Delete(&recipe)
	c.JSON(http.StatusOK, gin.H{
		"message": "recipe successfully deleted",
	})
}

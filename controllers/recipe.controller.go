package controllers

import (
	"errors"
	"net/http"

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

func (rc *RecipeController) FindOne(c *gin.Context) {
	var recipe models.Recipe
	id := c.Param("id")
	res := rc.DB.Find(&recipe, id)

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

func (rc *RecipeController) List(c *gin.Context) {
	var recipes []models.Recipe

	res := rc.DB.Find(&recipes)

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
func (rc *RecipeController) CreateOne(c *gin.Context) {
	var recipe *models.Recipe
	err := c.ShouldBind(&recipe)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	res := rc.DB.Create(recipe)
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
func (rc *RecipeController) UpdateOne(c *gin.Context) {
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
	res := rc.DB.Model(&updateRecipe).Where("id= ?", id).Updates(recipe)

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
func (rc *RecipeController) DeleteOne(c *gin.Context) {
	var recipe models.Recipe
	id := c.Param("id")
	res := rc.DB.Find(&recipe, id)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "recipe not found",
		})
		return
	}

	rc.DB.Delete(&recipe)
	c.JSON(http.StatusOK, gin.H{
		"message": "recipe successfully deleted",
	})
}

package main

import (
	"fmt"
	"net/http"

	recipes "barflow.app/api/controller/recipes"
	"barflow.app/api/database"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting application...")
	database.DatabaseConnection()

	r := gin.Default()

	r.GET("/", homePage)
	r.GET("/recipes/:id", recipes.ReadRecipe)
	r.GET("/recipes", recipes.ListRecipes)
	r.POST("/recipes", recipes.CreateRecipe)
	r.PUT("/recipes/:id", recipes.UpdateRecipe)

	r.Run(":5000")
}

func homePage(c *gin.Context) {
	c.String(http.StatusOK, "This is my homepage")
}

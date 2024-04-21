package main

import (
	"fmt"
	"net/http"

	"barflow.app/api/controllers"
	"barflow.app/api/database"
	"barflow.app/api/routes"

	"github.com/gin-gonic/gin"
)

var (
	server                *gin.Engine
	RecipeController      controllers.RecipeController
	RecipeRouteController routes.RecipeRouteController

	IngredientController      controllers.IngredientController
	IngredientRouteController routes.IngredientRouteController

	FlavorController      controllers.FlavorController
	FlavorRouteController routes.FlavorRouteController
)

func init() {
	database.DatabaseConnection()
	RecipeController = controllers.NewRecipeController(database.DB)
	RecipeRouteController = routes.NewRecipeRouteController(RecipeController)

	IngredientController = controllers.NewIngredientController(database.DB)
	IngredientRouteController = routes.NewIngredientRouteController(IngredientController)

	FlavorController = controllers.NewFlavorController(database.DB)
	FlavorRouteController = routes.NewFlavorRouteController(FlavorController)

	server = gin.Default()
}

func main() {
	fmt.Println("Starting application...")

	// TODO: CORS

	router := server.Group("/api")
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "Welcome to the Barflow API",
		})
	})

	// routes
	RecipeRouteController.RecipeRoute(router)
	FlavorRouteController.FlavorRoute(router)
	IngredientRouteController.IngredientRoute(router)
	fmt.Println(server.Run())
}

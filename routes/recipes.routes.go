package routes

import (
	"barflow.app/api/controllers"
	"github.com/gin-gonic/gin"
)

type RecipeRouteController struct {
	recipeController controllers.RecipeController
}

func NewRecipeRouteController(recipeController controllers.RecipeController) RecipeRouteController {
	return RecipeRouteController{recipeController}
}

func (rc *RecipeRouteController) RecipeRoute(rg *gin.RouterGroup) {
	router := rg.Group("recipes")
	router.POST("/", rc.recipeController.CreateOne)
	router.GET("/", rc.recipeController.List)
	router.GET("/:id", rc.recipeController.FindOne)
	router.PUT("/:id", rc.recipeController.UpdateOne)
	router.DELETE("/:id", rc.recipeController.DeleteOne)
}

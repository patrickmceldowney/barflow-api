package routes

import (
	"barflow.app/api/controllers"
)

type RecipeRouteController struct {
	recipeController controllers.RecipeController
}

func NewRecipeRouteController(recipeController controllers.RecipeController) RecipeRouteController {
	return RecipeRouteController{recipeController}
}

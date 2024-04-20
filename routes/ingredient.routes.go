package routes

import (
	"barflow.app/api/controllers"
)

type IngredientRouteController struct {
	ingredientController controllers.IngredientController
}

func NewIngredientRouteController(ingredientController controllers.IngredientController) IngredientRouteController {
	return IngredientRouteController{ingredientController}
}

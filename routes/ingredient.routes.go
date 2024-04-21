package routes

import (
	"barflow.app/api/controllers"
	"github.com/gin-gonic/gin"
)

type IngredientRouteController struct {
	ingredientController controllers.IngredientController
}

func NewIngredientRouteController(ingredientController controllers.IngredientController) IngredientRouteController {
	return IngredientRouteController{ingredientController}
}

func (ic *IngredientRouteController) IngredientRoute(rg *gin.RouterGroup) {
	// router := rg.Group("ingredients")
	// router.POST("/", ic.ingredientController.CreateOne)
	// router.GET("/", ic.ingredientController.List)
	// router.GET("/:id", ic.ingredientController.FindOne)
	// router.PUT("/:id", ic.ingredientController.UpdateOne)
	// router.DELETE("/:id", ic.ingredientController.DeleteOne)
}

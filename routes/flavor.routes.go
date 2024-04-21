package routes

import (
	"barflow.app/api/controllers"
	"github.com/gin-gonic/gin"
)

type FlavorRouteController struct {
	flavorController controllers.FlavorController
}

func NewFlavorRouteController(flavorController controllers.FlavorController) FlavorRouteController {
	return FlavorRouteController{flavorController}
}

func (fc *FlavorRouteController) FlavorRoute(rg *gin.RouterGroup) {
	// router := rg.Group("flavors")
	// router.POST("/", fc.flavorController.CreateOne)
	// router.GET("/", fc.flavorController.List)
	// router.GET("/:id", fc.flavorController.FindOne)
	// router.PUT("/:id", fc.flavorController.UpdateOne)
	// router.DELETE("/:id", fc.flavorController.DeleteOne)
}

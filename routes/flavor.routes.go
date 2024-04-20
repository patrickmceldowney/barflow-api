package routes

import (
	"barflow.app/api/controllers"
)

type FlavorRouteController struct {
	flavorController controllers.FlavorController
}

func NewFlavorRouteController(flavorController controllers.FlavorController) FlavorRouteController {
	return FlavorRouteController{flavorController}
}

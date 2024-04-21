package controllers

import "gorm.io/gorm"

type FlavorController struct {
	DB *gorm.DB
}

func NewFlavorController(DB *gorm.DB) FlavorController {
	return FlavorController{DB}
}

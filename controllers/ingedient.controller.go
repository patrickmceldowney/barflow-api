package controllers

import "gorm.io/gorm"

type IngredientController struct {
	DB *gorm.DB
}

func NewIngredientController(DB *gorm.DB) IngredientController {
	return IngredientController{DB}
}

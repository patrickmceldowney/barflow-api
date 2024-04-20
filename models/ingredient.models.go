package models

import "gorm.io/gorm"

type Ingredient struct {
	gorm.Model
	Name     string `json:"name" binding:"required"`
	Category string `json:"category"` // e.g. spirit, mixer, garnish
}

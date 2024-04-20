package models

import "gorm.io/gorm"

type Recipe struct {
	gorm.Model
	Name         string       `json:"name" bind:"required"`
	Description  string       `json:"description"`
	Ingredients  []Ingredient `json:"ingredients" binding:"required"`
	Instructions string       `json:"instructions" bind:"required"`
	Image        string       `json:"image"`
	Flavors      []Flavor     `json:"flavors"`    // sweet, sour, bitter, fruity, dry
	Categories   []string     `json:"categories"` // martini, margarita, mocktail, etc.
}

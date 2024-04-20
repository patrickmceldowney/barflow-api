package models

import "gorm.io/gorm"

type Flavor struct {
	gorm.Model
	Name        string `json:"name" bind:"required"`
	Description string `json:"description"`
}

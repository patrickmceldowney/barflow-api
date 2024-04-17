package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB
var err error

type Flavor struct {
	gorm.Model
	Name        string `json:"name" bind:"required"`
	Description string `json:"description"`
}

type Ingredient struct {
	gorm.Model
	Name     string `json:"name" binding:"required"`
	Category string `json:"category"` // e.g. spirit, mixer, garnish
}

type Cocktail struct {
	gorm.Model
	Name         string       `json:"name" bind:"required"`
	Description  string       `json:"description"`
	Ingredients  []Ingredient `json:"ingredients" binding:"required"`
	Instructions string       `json:"instructions" bind:"required"`
	Image        string       `json:"image"`
	Flavors      []Flavor     `json:"flavors"`    // sweet, sour, bitter, fruity, dry
	Categories   []string     `json:"categories"` // martini, margarita, mocktail, etc.
}

func DatabaseConnection() {
	host := "localhost"
	port := "5432"
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dsn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
		host,
		port,
		dbUser,
		dbName,
		password,
	)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	DB.AutoMigrate(Flavor{}, Ingredient{}, Cocktail{})

	if err != nil {
		log.Fatal("Error connecting to the datbase...", err)
	}

	fmt.Println("Database connection successful...")

}

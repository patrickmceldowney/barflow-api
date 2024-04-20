package database

import (
	"fmt"
	"log"
	"os"

	"barflow.app/api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB
var err error

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
	DB.AutoMigrate(models.Flavor{}, models.Ingredient{}, models.Recipe{})

	if err != nil {
		log.Fatal("Error connecting to the datbase...", err)
	}

	fmt.Println("Database connection successful...")

}

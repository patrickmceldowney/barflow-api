package main

import (
	"fmt"

	cocktails "barflow.app/api/controller/cocktails"
	"barflow.app/api/database"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting application...")
	database.DatabaseConnection()

	r := gin.Default()
	r.GET("/cocktails/:id", cocktails.ReadCocktail)
	r.GET("/cocktails", cocktails.ReadCocktails)
	r.POST("/cocktails", cocktails.CreateCocktail)
	r.PUT("/cocktails/:id", cocktails.UpdateCocktail)

	r.Run(":5000")
}

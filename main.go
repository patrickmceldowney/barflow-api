package main

import (
	"fmt"

	controllers "barflow.app/api/controller"
	"barflow.app/api/database"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting application...")
	database.DatabaseConnection()

	r := gin.Default()
	r.GET("/cocktails/:id", controllers.ReadCocktail)
	r.GET("/cocktails", controllers.ReadCocktails)

	r.Run(":5000")
}

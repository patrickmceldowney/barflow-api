package main

import (
	"fmt"

	"barflow/web-service/database"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting application...")
	database.DatabaseConnection()

	r := gin.Default()

	r.Run(":5000")
}

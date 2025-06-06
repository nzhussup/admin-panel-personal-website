package main

import (
	"api-gateway/internal/routes"
	"log"
)

// @title           API Gateway
// @version         1.0
// @description     Gateway that proxies requests to multiple microservices.
// @termsOfService  http://swagger.io/terms/

// @contact.name   Nurzhanat Zhussup
// @contact.email  zhussup.nb@gmail.com

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8082
// @BasePath  /
func main() {
	log.Println("Starting Go API Gateway...")

	r := routes.SetupRouter()
	r.Run(":8082")

}

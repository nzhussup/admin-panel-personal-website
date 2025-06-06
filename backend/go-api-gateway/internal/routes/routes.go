package routes

import (
	"api-gateway/internal/middleware"
	"api-gateway/internal/proxy"

	"os"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())
	r.RedirectTrailingSlash = false

	authServiceURL := os.Getenv("AUTH_SERVICE_URL")
	baseServiceURL := os.Getenv("BASE_SERVICE_URL")
	userServiceURL := os.Getenv("USER_SERVICE_URL")
	imageServiceURL := os.Getenv("IMAGE_SERVICE_URL")
	weddingServiceURL := os.Getenv("WEDDING_SERVICE_URL")

	// Middleware setup := middlewar(authServiceURL)
	r.Use(middleware.CorsMiddleware())

	r.Static("/docs", "./public/docs")

	r.GET("/docs", func(c *gin.Context) {
		c.File("./public/docs/index.html")
	})

	// Routes
	//// Gateway Main Page
	r.GET("/", func(c *gin.Context) {
		c.File("public/index.html")
	})
	//// Wedding
	r.Any("/api/v1/wedding", proxy.NewServiceProxy(weddingServiceURL))
	r.Any("/api/v1/wedding/*proxyPath", proxy.NewServiceProxy(weddingServiceURL))
	//// Auth
	r.Any("/auth/*proxyPath", proxy.NewServiceProxy(authServiceURL))
	//// Base
	v1 := r.Group("/v1")
	v1.Any("/base/*proxyPath", proxy.NewServiceProxy(baseServiceURL))
	//// Image
	v1.Any("/album", proxy.NewServiceProxy(imageServiceURL))
	v1.Any("/album/*proxyPath", proxy.NewServiceProxy(imageServiceURL))
	//// User
	v1.Any("/user", proxy.NewServiceProxy(userServiceURL))
	v1.Any("/user/*proxyPath", proxy.NewServiceProxy(userServiceURL))

	return r
}

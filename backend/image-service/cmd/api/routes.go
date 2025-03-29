package main

import (
	"image-service/internal/config/security"
	"image-service/internal/controller"

	"github.com/gin-gonic/gin"
)

func (a *app) GetRouter() *gin.Engine {
	r := gin.Default()
	r.Use(security.AuthMiddleware(a.Discovery.GetServiceURL(a.config.discoveryConfig.servicesConfig.authService)))

	v1 := r.Group(a.config.apiBasePath)
	v1.GET("/health", controller.HealthCheckHandler)
	v1.GET("", a.Controller.AlbumController.GetPreview)
	v1.GET("/:id", a.Controller.AlbumController.Get)
	v1.POST("", a.Controller.AlbumController.Create)
	v1.PUT("/:id", a.Controller.AlbumController.Update)
	v1.DELETE("/:id", a.Controller.AlbumController.Delete)

	v1.POST("/:id/upload", a.Controller.ImageController.Upload)
	v1.DELETE("/:id/:imageID", a.Controller.ImageController.Delete)
	v1.GET("/:id/:imageID", a.Controller.ImageController.Serve)
	return r
}

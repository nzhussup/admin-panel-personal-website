package controller

import (
	"image-service/internal/service"

	"github.com/gin-gonic/gin"
)

type CacheController struct {
	service *service.Service
}

func (ctrl *CacheController) ClearCache(c *gin.Context) {

	err := ctrl.service.CacheService.ClearCache()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Cache cleared successfully"})
}

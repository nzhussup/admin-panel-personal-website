package controller

import (
	"image-service/internal/service"

	"github.com/gin-gonic/gin"
)

type CacheController struct {
	service *service.Service
}

func NewCacheController(service *service.Service) *CacheController {
	return &CacheController{service: service}
}

// ClearCache godoc
// @Summary Clear the image cache
// @Description This endpoint clears the server-side cache for images.
// @Tags Cache
// @Accept  json
// @Produce  json
// @Success 200 {object} map[string]string "Cache cleared successfully"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /v1/album/cache [delete]
// @Security ApiKeyAuth
func (ctrl *CacheController) ClearCache(c *gin.Context) {

	err := ctrl.service.CacheService.ClearCache()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Cache cleared successfully"})
}

package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheckHandler godoc
// @Summary Health check endpoint
// @Description Returns 200 OK if the service is up
// @Tags Health
// @Produce json
// @Success 200 {object} map[string]string "Service is healthy"
// @Router /v1/album/health [get]
func HealthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

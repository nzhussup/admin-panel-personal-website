package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {

	discoveryConfig := &discoveryConfig{
		eurekaURL:   "http://discovery-server.default.svc.cluster.local:8761/eureka",
		appName:     "image-service",
		refreshRate: 30,
		servicesConfig: &servicesConfig{
			authService: "auth-service",
		},
	}

	var port int = 8085

	cfg := config{
		addr:            fmt.Sprintf(":%d", port),
		port:            port,
		storagePath:     "var/images",
		apiBasePath:     "/api/v1/album",
		discoveryConfig: discoveryConfig,
		redisConfig: &redisConfig{
			addr:     "redis-service.default.svc.cluster.local:6379",
			password: "",
			db:       0,
			duration: 24 * time.Hour,
		},
	}

	app := newApp(cfg)
	gin.SetMode(gin.ReleaseMode)
	if gin.Mode() != gin.DebugMode {
		app.Discovery.RegisterWithEureka()
		defer app.Discovery.DeregisterWithEureka()
	}
	app.Redis.CheckHealth()

	app.run()
}

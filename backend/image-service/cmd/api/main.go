package main

import (
	"fmt"
	"image-service/internal/env"
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
			addr: fmt.Sprintf(
				"%s:%d",
				env.GetString("REDIS_HOST", "redis-service.default.svc.cluster.local"),
				env.GetInt("REDIS_PORT", 6379)),
			password: "",
			db:       0,
			duration: 24 * time.Hour,
		},
		apiGatewayURL: "https://api.nzhussup.com",
	}

	secuirityCfg := GetSecurityConfig(&cfg)

	app := newApp(cfg, secuirityCfg)
	gin.SetMode(gin.ReleaseMode)
	if gin.Mode() != gin.DebugMode {
		app.Discovery.RegisterWithEureka()
		defer app.Discovery.DeregisterWithEureka()
	}
	app.Redis.CheckHealth()

	app.run()
}

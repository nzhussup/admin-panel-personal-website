package main

import (
	"image-service/internal/config/cache"
	"image-service/internal/config/discovery"
	"image-service/internal/config/security"
	"image-service/internal/controller"
	"image-service/internal/repository"
	"image-service/internal/service"
	"time"
)

type app struct {
	config         config
	securityConfig *security.AuthConfig
	Controller     *controller.Controller
	Service        *service.Service
	Storage        *repository.Storage
	Discovery      *discovery.EurekaClient
	Redis          *cache.RedisClient
}

type config struct {
	addr            string
	port            int
	storagePath     string
	apiBasePath     string
	discoveryConfig *discoveryConfig
	redisConfig     *redisConfig
	apiGatewayURL   string
}

type discoveryConfig struct {
	eurekaURL      string
	appName        string
	refreshRate    int
	servicesConfig *servicesConfig
}

type servicesConfig struct {
	authService string
}

type redisConfig struct {
	addr     string
	password string
	db       int
	duration time.Duration
}

func newApp(config config, securityConfig *security.AuthConfig) *app {
	redisClient := cache.NewRedisClient(
		config.redisConfig.addr,
		config.redisConfig.password,
		config.redisConfig.db,
		config.redisConfig.duration,
	)
	storage := repository.NewStorage(config.storagePath, config.apiBasePath)
	service := service.NewService(storage, redisClient, securityConfig)
	controller := controller.NewController(service)
	eurekaClient := discovery.NewEurekaClient(
		config.discoveryConfig.eurekaURL,
		config.discoveryConfig.appName,
		config.port,
		config.discoveryConfig.refreshRate,
	)

	return &app{
		config:         config,
		securityConfig: securityConfig,
		Controller:     controller,
		Service:        service,
		Storage:        storage,
		Discovery:      eurekaClient,
		Redis:          redisClient,
	}
}

func (a *app) run() {
	router := a.GetRouter()
	router.Run(a.config.addr)
}

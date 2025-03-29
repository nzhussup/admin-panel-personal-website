package main

import (
	"image-service/internal/config/discovery"
	"image-service/internal/controller"
	"image-service/internal/repository"
	"image-service/internal/service"
)

type app struct {
	config     config
	Controller *controller.Controller
	Service    *service.Service
	Storage    *repository.Storage
	Discovery  *discovery.EurekaClient
}

type config struct {
	addr            string
	port            int
	storagePath     string
	apiBasePath     string
	discoveryConfig *discoveryConfig
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

func newApp(config config) *app {
	storage := repository.NewStorage(config.storagePath, config.apiBasePath)
	service := service.NewService(storage)
	controller := controller.NewController(service)
	eurekaClient := discovery.NewEurekaClient(config.discoveryConfig.eurekaURL, config.discoveryConfig.appName,
		config.port, config.discoveryConfig.refreshRate)
	return &app{
		config:     config,
		Controller: controller,
		Service:    service,
		Storage:    storage,
		Discovery:  eurekaClient,
	}
}

func (a *app) run() {
	router := a.GetRouter()
	router.Run(a.config.addr)
}

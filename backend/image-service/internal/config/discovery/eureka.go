package discovery

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/ArthurHlt/go-eureka-client/eureka"
)

type EurekaClient struct {
	Client      *eureka.Client
	Port        int
	AppName     string
	URL         string
	RefreshRate int
}

func NewEurekaClient(url string, appName string, port int, refreshRate int) *EurekaClient {
	client := eureka.NewClient([]string{url})
	return &EurekaClient{
		Client:      client,
		Port:        port,
		AppName:     appName,
		URL:         url,
		RefreshRate: refreshRate,
	}
}

func (client *EurekaClient) RegisterWithEureka() {

	podName := os.Getenv("POD_NAME")
	podIP := os.Getenv("POD_IP")

	if podName == "" || podIP == "" {
		log.Println("⚠️ POD_NAME or POD_IP is empty. Ensure these environment variables are set in Kubernetes.")
	}

	instanceID := fmt.Sprintf("%s:%s:%d", podName, client.AppName, client.Port)

	instance := eureka.NewInstanceInfo(
		instanceID,
		client.AppName,
		client.AppName,
		client.Port,
		uint(client.RefreshRate),
		false,
	)

	instance.Metadata = &eureka.MetaData{Map: map[string]string{
		"instanceId":      instanceID,
		"k8sService":      client.AppName,
		"hostname":        client.AppName,
		"management.port": fmt.Sprintf("%d", client.Port),
	}}

	instance.HostName = client.AppName
	instance.IpAddr = podIP
	instance.Status = eureka.UP
	instance.StatusPageUrl = fmt.Sprintf("http://%s:%d/actuator/info", client.AppName, client.Port)
	instance.HealthCheckUrl = fmt.Sprintf("http://%s:%d/actuator/health", client.AppName, client.Port)
	instance.VipAddress = client.AppName
	instance.SecureVipAddress = client.AppName

	for {
		err := client.Client.RegisterInstance(client.AppName, instance)
		if err == nil {
			log.Println("✅ Registered with Eureka: ", client.AppName)
			break
		}
		log.Printf("⚠️ Eureka registration failed, retrying...")
		time.Sleep(5 * time.Second)
	}

	go client.KeepAliveWithEureka(instance.App, instanceID)
}

func (client *EurekaClient) KeepAliveWithEureka(app string, instanceID string) {
	log.Println("💓 Sending heartbeats to Eureka")

	for {
		err := client.Client.SendHeartbeat(app, instanceID)
		if err != nil {
			log.Printf("⚠️ Eureka heartbeat failed: %v", err)
		} else {
			log.Println("💓 Eureka heartbeat sent successfully")
		}
		time.Sleep(25 * time.Second)
	}
}

func (client *EurekaClient) DeregisterWithEureka() {
	podName := os.Getenv("POD_NAME")
	instanceID := fmt.Sprintf("%s:%s:%d", podName, client.AppName, client.Port)

	err := client.Client.UnregisterInstance(client.AppName, instanceID)
	if err != nil {
		log.Printf("⚠️ Failed to deregister from Eureka: %v", err)
	} else {
		log.Println("✅ Deregistered from Eureka")
	}
}

func (client *EurekaClient) GetServiceURL(serviceName string) (string, error) {
	app, err := client.Client.GetApplication(serviceName)
	if err != nil {
		return "", err
	}

	// Don't wanna implement a load balancer, so we just pick a random instance :D
	instance := app.Instances[rand.Intn(len(app.Instances))]
	url := fmt.Sprintf("http://%s:%d", instance.IpAddr, instance.Port.Port)
	return url, nil
}

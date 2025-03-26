package discovery

import (
	"fmt"
	"log"
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

	for i := 0; i < 3; i++ {
		err := client.Client.RegisterInstance(client.AppName, instance)
		if err == nil {
			log.Println("✅ Registered with Eureka: ", client.AppName)
			break
		}
		log.Printf("⚠️ Eureka registration failed (attempt %d): %v", i+1, err)
		time.Sleep(5 * time.Second)
	}

	go client.KeepAliveWithEureka(instanceID)
}

func (client *EurekaClient) KeepAliveWithEureka(instanceID string) {
	instanceID = fmt.Sprintf("%s:%s", client.AppName, instanceID)

	for {
		time.Sleep(25 * time.Second)

		err := client.Client.SendHeartbeat(client.AppName, instanceID)
		if err != nil {
			log.Printf("⚠️ Eureka heartbeat failed: %v", err)

			for retry := 1; retry <= 3; retry++ {
				time.Sleep(5 * time.Second)
				err := client.Client.SendHeartbeat(client.AppName, instanceID)
				if err == nil {
					log.Println("✅ Eureka heartbeat recovered")
					break
				}
				log.Printf("⚠️ Heartbeat retry %d failed: %v", retry, err)
			}
		} else {
			log.Println("💓 Eureka heartbeat sent successfully")
		}
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

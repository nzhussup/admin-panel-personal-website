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

	for {
		err := client.Client.RegisterInstance(client.AppName, instance)
		if err == nil {
			log.Println("✅ Successfully registered with Eureka:", client.AppName)
			break
		}
		log.Printf("⚠️ Eureka registration failed, retrying in 5 seconds... Error: %v", err)
		time.Sleep(5 * time.Second)
	}

	go client.KeepAliveWithEureka(instance.App, instanceID, instance)
}

func (client *EurekaClient) KeepAliveWithEureka(app string, instanceID string, instance *eureka.InstanceInfo) {
	log.Println("💓 Sending heartbeats to Eureka")

	heartbeatFailed := false

	for {
		err := client.Client.SendHeartbeat(app, instanceID)
		if err != nil {
			log.Printf("⚠️ Eureka heartbeat failed: %v", err)

			if !client.IsInstanceRegistered(app, instanceID) {
				log.Println("🔄 Instance is no longer registered. Re-registering...")

				err := client.Client.RegisterInstance(client.AppName, instance)
				if err != nil {
					log.Printf("❌ Failed to re-register instance: %v", err)
				} else {
					log.Println("✅ Instance successfully re-registered!")
				}
			}

			heartbeatFailed = true
		} else {
			if heartbeatFailed {
				log.Println("✅ Heartbeat restored!")
				heartbeatFailed = false
			}
		}

		time.Sleep(25 * time.Second)
	}
}

func (client *EurekaClient) IsInstanceRegistered(app string, instanceID string) bool {
	instance, err := client.Client.GetInstance(app, instanceID)
	if err != nil || instance == nil {
		return false
	}
	return true
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

// func (client *EurekaClient) GetServiceURL(serviceName string) (string, error) {
// 	app, err := client.Client.GetApplication(serviceName)
// 	if err != nil {
// 		return "", err
// 	}

// 	// Don't wanna implement a load balancer, so we just pick a random instance :D
// 	instance := app.Instances[rand.Intn(len(app.Instances))]
// 	url := fmt.Sprintf("http://%s:%d", instance.IpAddr, instance.Port.Port)
// 	return url, nil
// }

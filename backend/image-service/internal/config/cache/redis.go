package cache

import (
	"context"
	"encoding/json"
	"fmt"
	custom_errors "image-service/internal/errors"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	Client   *redis.Client
	Duration time.Duration
}

func NewRedisClient(addr, password string, db int, duration time.Duration) *RedisClient {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})
	return &RedisClient{
		Client:   client,
		Duration: duration,
	}
}

func (r *RedisClient) CheckHealth() {
	ctx := context.Background()
	_, err := r.Client.Ping(ctx).Result()
	if err != nil {
		log.Println("CACHE ERROR: Redis is not reachable:", err)
	} else {
		fmt.Println("CACHE: Redis is reachable")
	}
}

func (r *RedisClient) Set(key string, value any) {
	ctx := context.Background()

	jsonData, err := json.Marshal(value)
	if err != nil {
		log.Println("CACHE ERROR: Failed to marshal value for cache:", err)
		return
	}

	err = r.Client.Set(ctx, key, jsonData, r.Duration).Err()
	if err != nil {
		log.Println("CACHE ERROR: Failed to set value in cache:", err)
		return
	}
}

func (r *RedisClient) Get(key string, dest any) error {
	ctx := context.Background()
	val, err := r.Client.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			log.Println("CACHE INFO: Key does not exist in cache:", key)
			return custom_errors.NewBadRequestError("Key does not exist in cache")
		}
		log.Println("CACHE ERROR: Failed to get value from cache:", err)
		return custom_errors.NewInternalServerError("Failed to get value from cache")
	}

	err = json.Unmarshal([]byte(val), dest)
	if err != nil {
		log.Println("CACHE ERROR: Failed to unmarshal value from cache:", err)
		return custom_errors.NewBadRequestError("Failed to unmarshal value from cache")
	}

	return nil
}

func (r *RedisClient) Del(key string) {

	ctx := context.Background()
	err := r.Client.Del(ctx, key).Err()
	if err != nil {
		fmt.Println("CACHE ERROR: Failed to delete cache:", err)
		fmt.Println("CACHE INFO: Flushing all the cache")
		err = r.Client.FlushAll(ctx).Err()
		if err != nil {
			fmt.Println("CACHE ERROR: Failed to flush all cache:", err)
		}
	}
}

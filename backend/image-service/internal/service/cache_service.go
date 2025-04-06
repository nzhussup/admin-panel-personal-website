package service

import "image-service/internal/config/cache"

type CacheService struct {
	redis *cache.RedisClient
}

func (s *CacheService) ClearCache() error {
	err := s.redis.FlushAll()
	if err != nil {
		return err
	}

	return nil
}

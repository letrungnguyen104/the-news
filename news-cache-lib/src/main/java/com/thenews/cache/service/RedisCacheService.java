package com.thenews.cache.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisCacheService {

  private final RedisTemplate<String, Object> redisTemplate;
  private final ObjectMapper objectMapper;

  public <T> Optional<T> get(String key, Class<T> clazz) {
    try {
      Object data = redisTemplate.opsForValue().get(key);
      if (data == null) {
        return Optional.empty();
      }
      return Optional.ofNullable(objectMapper.convertValue(data, clazz));
    } catch (Exception e) {
      log.error("Lỗi đọc cache key {}: {}", key, e.getMessage());
      return Optional.empty();
    }
  }

  public void set(String key, Object value, Duration ttl) {
    try {
      log.info("💾 START: Đang ghi vào Redis key={}", key);
      redisTemplate.opsForValue().set(key, value, ttl);
      log.info("✅ SUCCESS: Đã lưu vào Redis thành công!");
    } catch (Exception e) {
      log.error("❌ FAILURE: Lỗi ghi cache! Nguyên nhân: {}", e.getMessage());
      e.printStackTrace();
    }
  }

  public void delete(String key) {
    redisTemplate.delete(key);
  }
}
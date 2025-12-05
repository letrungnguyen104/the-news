// File: com/thenews/news_read_api/service/ViewCountService.java
package com.thenews.news_read_api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ViewCountService {

  private final StringRedisTemplate redisTemplate;

  private static final String VIEW_COUNT_KEY_PREFIX = "article:view_count:";
  private static final String CHANGED_ARTICLES_SET = "article:view_changed_ids";

  /**
   * Hàm này được gọi khi người dùng đọc báo.
   * Chỉ ghi vào Redis, không gọi DB -> Không bao giờ bị lỗi Transaction
   * Read-Only.
   */
  public void bufferViewCount(Long articleId) {
    try {
      // 1. Tăng biến đếm cho bài viết cụ thể (Key: article:view_count:123)
      redisTemplate.opsForValue().increment(VIEW_COUNT_KEY_PREFIX + articleId);

      // 2. Lưu ID bài viết vào danh sách "cần cập nhật" (Set)
      redisTemplate.opsForSet().add(CHANGED_ARTICLES_SET, String.valueOf(articleId));
    } catch (Exception e) {
      log.error("Lỗi ghi view vào Redis (không ảnh hưởng user): {}", e.getMessage());
    }
  }
}
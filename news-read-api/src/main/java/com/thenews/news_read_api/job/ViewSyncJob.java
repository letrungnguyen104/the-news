package com.thenews.news_read_api.job;

import com.thenews.news_read_api.repository.ArticleReadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class ViewSyncJob {

  private final ArticleReadRepository articleReadRepository;
  private final StringRedisTemplate redisTemplate;

  private static final String VIEW_COUNT_KEY_PREFIX = "article:view_count:";
  private static final String CHANGED_ARTICLES_SET = "article:view_changed_ids";

  @Scheduled(fixedRate = 300000)
  @Transactional
  public void syncViewsFromRedisToDb() {
    Set<String> articleIds = redisTemplate.opsForSet().members(CHANGED_ARTICLES_SET);

    if (articleIds == null || articleIds.isEmpty()) {
      return;
    }

    log.info("Bắt đầu đồng bộ view cho {} bài viết...", articleIds.size());

    for (String idStr : articleIds) {
      try {
        Long articleId = Long.parseLong(idStr);
        String key = VIEW_COUNT_KEY_PREFIX + articleId;

        String viewCountStr = redisTemplate.opsForValue().getAndDelete(key);

        if (viewCountStr != null) {
          long viewsToAdd = Long.parseLong(viewCountStr);
          if (viewsToAdd > 0) {
            articleReadRepository.incrementViews(articleId, viewsToAdd);
          }
        }
      } catch (Exception e) {
        log.error("Lỗi đồng bộ view cho bài id {}: {}", idStr, e.getMessage());
      }
    }

    redisTemplate.delete(CHANGED_ARTICLES_SET);
    log.info("Đồng bộ view hoàn tất.");
  }
}
package com.thenews.news_read_api.service;

import com.thenews.cache.service.RedisCacheService;
import com.thenews.common.dto.ArticleCacheDto;
import com.thenews.common.entity.Article;
import com.thenews.news_read_api.repository.ArticleReadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleReadService {

  private final ArticleReadRepository articleReadRepository;
  private final RedisCacheService redisCacheService;

  private static final Duration CACHE_TTL = Duration.ofMinutes(10);

  @Transactional(readOnly = true)
  public Optional<ArticleCacheDto> getArticleBySlug(String slug) {
    String cacheKey = "article:" + slug;
    Optional<ArticleCacheDto> cachedDto = redisCacheService.get(cacheKey, ArticleCacheDto.class);
    if (cachedDto.isPresent()) {
      log.info("Cache HIT: Trả về bài viết từ Redis -> {}", slug);
      return cachedDto;
    }

    log.info("Cache MISS: Đọc từ Database -> {}", slug);
    Optional<Article> dbArticle = articleReadRepository.findBySlugAndStatus(slug, Article.Status.PUBLISHED);

    if (dbArticle.isPresent()) {
      Article article = dbArticle.get();
      ArticleCacheDto dto = ArticleCacheDto.builder()
          .id(article.getId())
          .title(article.getTitle())
          .slug(article.getSlug())
          .content(article.getContent())
          .thumbnail(article.getThumbnail())
          .status(article.getStatus().name())
          .createdAt(article.getCreatedAt())
          .authorName(article.getAuthor().getUsername())
          .build();

      log.info("Lưu DTO vào Redis...");
      redisCacheService.set(cacheKey, dto, CACHE_TTL);

      return Optional.of(dto);
    }

    return Optional.empty();
  }
}
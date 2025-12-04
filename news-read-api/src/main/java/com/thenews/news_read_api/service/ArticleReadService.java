package com.thenews.news_read_api.service;

import com.thenews.cache.service.RedisCacheService;
import com.thenews.common.dto.ArticleCacheDto;
import com.thenews.common.dto.ArticleListResponse;
import com.thenews.common.entity.Article;
import com.thenews.news_read_api.repository.ArticleReadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleReadService {

  private final ArticleReadRepository articleReadRepository;
  private final RedisCacheService redisCacheService;

  private static final Duration CACHE_TTL = Duration.ofMinutes(10);
  private static final String LATEST_ARTICLES_KEY = "home:latest_articles";

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
      List<ArticleCacheDto.PageDto> pageDtos = article.getPages().stream()
          .map(p -> new ArticleCacheDto.PageDto(p.getPageNumber(), p.getImageUrl(), p.getContent()))
          .sorted((p1, p2) -> p1.getPageNumber().compareTo(p2.getPageNumber()))
          .collect(Collectors.toList());

      ArticleCacheDto dto = ArticleCacheDto.builder()
          .id(article.getId())
          .title(article.getTitle())
          .slug(article.getSlug())
          .thumbnail(article.getThumbnail())
          .shortDescription(article.getShortDescription())
          .content(article.getContent())
          .status(article.getStatus().name())
          .createdAt(article.getCreatedAt())
          .authorName(article.getAuthor().getUsername())
          .categoryName(article.getCategory() != null ? article.getCategory().getName() : "Uncategorized")
          .categoryId(article.getCategory() != null ? article.getCategory().getId() : null)
          .categorySlug(article.getCategory() != null ? article.getCategory().getSlug() : null)
          .pages(pageDtos)
          .build();

      log.info("Lưu DTO vào Redis...");
      redisCacheService.set(cacheKey, dto, CACHE_TTL);
      return Optional.of(dto);
    }
    return Optional.empty();
  }

  @Transactional(readOnly = true)
  public List<ArticleCacheDto> getLatestArticles() {
    Optional<ArticleListResponse> cached = redisCacheService.get(LATEST_ARTICLES_KEY, ArticleListResponse.class);
    if (cached.isPresent()) {
      return cached.get().getArticles();
    }

    List<Article> articles = articleReadRepository.findAllByStatusOrderByCreatedAtDesc(Article.Status.PUBLISHED);

    List<ArticleCacheDto> dtos = articles.stream().map(article -> ArticleCacheDto.builder()
        .id(article.getId())
        .title(article.getTitle())
        .slug(article.getSlug())
        .thumbnail(article.getThumbnail())
        .shortDescription(article.getShortDescription())
        .status(article.getStatus().name())
        .createdAt(article.getCreatedAt())
        .authorName(article.getAuthor().getUsername())
        .categoryName(article.getCategory() != null ? article.getCategory().getName() : "Uncategorized")
        .categorySlug(article.getCategory() != null ? article.getCategory().getSlug() : null)
        .build()).toList();

    redisCacheService.set(LATEST_ARTICLES_KEY, new ArticleListResponse(dtos), CACHE_TTL);

    return dtos;
  }

  @Transactional(readOnly = true)
  public List<ArticleCacheDto> getArticlesByCategory(String categorySlug) {
    return articleReadRepository
        .findAllByCategory_SlugAndStatusOrderByCreatedAtDesc(categorySlug, Article.Status.PUBLISHED)
        .stream()
        .map(article -> ArticleCacheDto.builder()
            .id(article.getId())
            .title(article.getTitle())
            .slug(article.getSlug())
            .thumbnail(article.getThumbnail())
            .shortDescription(article.getShortDescription())
            .categoryName(article.getCategory().getName())
            .authorName(article.getAuthor().getUsername())
            .createdAt(article.getCreatedAt())
            .build())
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ArticleCacheDto> getRelatedArticles(Long categoryId, Long currentArticleId) {
    return articleReadRepository.findRelatedArticles(categoryId, currentArticleId, PageRequest.of(0, 4))
        .stream()
        .map(this::mapToDto)
        .toList();
  }

  private ArticleCacheDto mapToDto(Article article) {
    return ArticleCacheDto.builder()
        .id(article.getId())
        .title(article.getTitle())
        .slug(article.getSlug())
        .thumbnail(article.getThumbnail())
        .shortDescription(article.getShortDescription())
        .content(article.getContent())
        .status(article.getStatus().name())
        .createdAt(article.getCreatedAt())
        .authorName(article.getAuthor().getUsername())

        .categoryName(article.getCategory() != null ? article.getCategory().getName() : "Uncategorized")
        .categoryId(article.getCategory() != null ? article.getCategory().getId() : null)
        .categorySlug(article.getCategory() != null ? article.getCategory().getSlug() : null)
        .build();
  }
}
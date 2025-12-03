package com.thenews.news_read_api.controller;

import com.thenews.common.dto.ArticleCacheDto;
import com.thenews.news_read_api.service.ArticleReadService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
public class ArticleReadController {

  private final ArticleReadService articleReadService;

  @GetMapping("/{slug}")
  public ResponseEntity<ArticleCacheDto> getArticle(@PathVariable String slug) {
    return articleReadService.getArticleBySlug(slug)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<ArticleCacheDto>> getLatestArticles() {
    return ResponseEntity.ok(articleReadService.getLatestArticles());
  }

  @GetMapping("/category/{categorySlug}")
  public ResponseEntity<List<ArticleCacheDto>> getArticlesByCategory(@PathVariable String categorySlug) {
    return ResponseEntity.ok(articleReadService.getArticlesByCategory(categorySlug));
  }

  @GetMapping("/related/{categoryId}/{currentArticleId}")
  public ResponseEntity<List<ArticleCacheDto>> getRelatedArticles(
      @PathVariable Long categoryId,
      @PathVariable Long currentArticleId) {
    return ResponseEntity.ok(articleReadService.getRelatedArticles(categoryId, currentArticleId));
  }
}
package com.thenews.news_read_api.controller;

import com.thenews.common.dto.ArticleCacheDto;
import com.thenews.news_read_api.service.ArticleReadService;
import lombok.RequiredArgsConstructor;
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
}
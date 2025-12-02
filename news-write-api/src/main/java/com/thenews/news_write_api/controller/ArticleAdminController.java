package com.thenews.news_write_api.controller;

import com.thenews.news_write_api.dto.request.CreateArticleRequest;
import com.thenews.news_write_api.dto.request.UpdateArticleRequest;
import com.thenews.news_write_api.dto.response.ArticleResponse;
import com.thenews.news_write_api.service.ArticleAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/articles")
@RequiredArgsConstructor
public class ArticleAdminController {

  private final ArticleAdminService articleAdminService;

  @PostMapping
  public ResponseEntity<ArticleResponse> createArticle(@RequestBody CreateArticleRequest request) {
    return ResponseEntity.ok(articleAdminService.createArticle(request));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ArticleResponse> updateArticle(@PathVariable Long id,
      @RequestBody UpdateArticleRequest request) {
    return ResponseEntity.ok(articleAdminService.updateArticle(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
    articleAdminService.deleteArticle(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<List<ArticleResponse>> getAllArticles() {
    return ResponseEntity.ok(articleAdminService.getAllArticles());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ArticleResponse> getArticleById(@PathVariable Long id) {
    return ResponseEntity.ok(articleAdminService.getArticleById(id));
  }
}
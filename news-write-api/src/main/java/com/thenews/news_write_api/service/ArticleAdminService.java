package com.thenews.news_write_api.service;

import com.thenews.common.entity.Article;
import com.thenews.common.entity.Category;
import com.thenews.common.entity.User;
import com.thenews.news_write_api.dto.request.CreateArticleRequest;
import com.thenews.news_write_api.dto.request.UpdateArticleRequest;
import com.thenews.news_write_api.dto.response.ArticleResponse;
import com.thenews.news_write_api.mapper.ArticleMapper;
import com.thenews.news_write_api.repository.ArticleRepository;
import com.thenews.news_write_api.repository.CategoryRepository;
import com.thenews.news_write_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleAdminService {

  private final ArticleRepository articleRepository;
  private final UserRepository userRepository;
  private final ArticleMapper articleMapper;

  private final CategoryRepository categoryRepository;

  public ArticleResponse createArticle(CreateArticleRequest request) {
    User author = userRepository.findById(request.getAuthorId())
        .orElseThrow(() -> new RuntimeException("Author not found"));

    Category category = null;
    if (request.getCategoryId() != null) {
      category = categoryRepository.findById(request.getCategoryId())
          .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    Article article = articleMapper.toEntity(request);
    article.setSlug(toSlug(request.getTitle()));
    article.setStatus(Article.Status.PUBLISHED);
    article.setAuthor(author);
    article.setCategory(category);

    return articleMapper.toResponse(articleRepository.save(article));
  }

  @Transactional
  public ArticleResponse updateArticle(Long id, UpdateArticleRequest request) {
    Article article = articleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Article not found"));
    articleMapper.updateArticleFromRequest(request, article);

    if (request.getTitle() != null) {
      article.setSlug(toSlug(request.getTitle()));
    }
    if (request.getCategoryId() != null) {
      Category category = categoryRepository.findById(request.getCategoryId())
          .orElseThrow(() -> new RuntimeException("Category not found"));
      article.setCategory(category);
    }

    Article updatedArticle = articleRepository.save(article);
    return articleMapper.toResponse(updatedArticle);
  }

  public void deleteArticle(Long id) {
    articleRepository.deleteById(id);
    // TODO: Bắn event xóa Cache
  }

  public List<ArticleResponse> getAllArticles() {
    return articleRepository.findAll().stream()
        .map(articleMapper::toResponse)
        .collect(Collectors.toList());
  }

  public ArticleResponse getArticleById(Long id) {
    Article article = articleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Article not found"));
    return articleMapper.toResponse(article);
  }

  private String toSlug(String input) {
    return input.toLowerCase()
        .replaceAll("[^a-z0-9\\s-]", "")
        .replace(" ", "-");
  }
}
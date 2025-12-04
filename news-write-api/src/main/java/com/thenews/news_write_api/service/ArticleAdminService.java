package com.thenews.news_write_api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thenews.cache.service.RedisCacheService;
import com.thenews.common.entity.Article;
import com.thenews.common.entity.ArticlePage;
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
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleAdminService {

  private final ArticleRepository articleRepository;
  private final UserRepository userRepository;
  private final ArticleMapper articleMapper;
  private final CategoryRepository categoryRepository;

  private final RedisCacheService redisCacheService;
  private static final String LATEST_ARTICLES_KEY = "home:latest_articles";

  private final StringRedisTemplate stringRedisTemplate;
  private final ObjectMapper objectMapper;

  public ArticleResponse createArticle(CreateArticleRequest request) {
    User author = getCurrentUser();

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

    if (request.getPages() != null) {
      List<ArticlePage> pages = request.getPages().stream().map(p -> {
        return ArticlePage.builder()
            .pageNumber(p.getPageNumber())
            .imageUrl(p.getImageUrl())
            .content(p.getContent())
            .article(article)
            .build();
      }).collect(Collectors.toList());
      article.setPages(pages);
    }

    Article savedArticle = articleRepository.save(article);
    redisCacheService.delete(LATEST_ARTICLES_KEY);

    ArticleResponse response = articleMapper.toResponse(savedArticle);

    try {
      String messageJson = objectMapper.writeValueAsString(response);
      stringRedisTemplate.convertAndSend("news_channel", messageJson);
      System.out.println("Đã bắn sự kiện tin mới: " + response.getTitle());
    } catch (Exception e) {
      System.err.println("Lỗi bắn Notification: " + e.getMessage());
      e.printStackTrace();
    }

    return response;
  }

  @Transactional
  public ArticleResponse updateArticle(Long id, UpdateArticleRequest request) {
    Article article = articleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Article not found"));
    User currentUser = getCurrentUser();
    if (currentUser.getRole() != User.Role.ADMIN && !article.getAuthor().getId().equals(currentUser.getId())) {
      throw new RuntimeException("Bạn không có quyền sửa bài viết này!");
    }

    if (request.getTitle() != null) {
      redisCacheService.delete("article:" + article.getSlug());
      article.setTitle(request.getTitle());
      article.setSlug(toSlug(request.getTitle()));
    }

    if (request.getShortDescription() != null)
      article.setShortDescription(request.getShortDescription());
    if (request.getContent() != null)
      article.setContent(request.getContent());
    if (request.getThumbnail() != null)
      article.setThumbnail(request.getThumbnail());

    if (request.getCategoryId() != null) {
      Category category = categoryRepository.findById(request.getCategoryId())
          .orElseThrow(() -> new RuntimeException("Category not found"));
      article.setCategory(category);
    }

    if (request.getPages() != null) {
      article.getPages().clear();
      List<ArticlePage> newPages = request.getPages().stream().map(p -> ArticlePage.builder()
          .pageNumber(p.getPageNumber())
          .imageUrl(p.getImageUrl())
          .content(p.getContent())
          .article(article)
          .build()).collect(Collectors.toList());
      article.getPages().addAll(newPages);
    }

    Article updatedArticle = articleRepository.save(article);

    redisCacheService.delete(LATEST_ARTICLES_KEY);
    redisCacheService.delete("article:" + updatedArticle.getSlug());

    return articleMapper.toResponse(updatedArticle);
  }

  private User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
  }

  public void deleteArticle(Long id) {
    Article article = articleRepository.findById(id).orElse(null);
    if (article != null) {
      String slug = article.getSlug();
      articleRepository.deleteById(id);
      redisCacheService.delete(LATEST_ARTICLES_KEY);
      redisCacheService.delete("article:" + slug);
    }
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
    if (input == null)
      return "";
    String slug = input.toLowerCase();
    slug = Normalizer.normalize(slug, Normalizer.Form.NFD);
    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    slug = pattern.matcher(slug).replaceAll("");
    slug = slug.replace("đ", "d");
    slug = slug.replaceAll("[^a-z0-9\\s-]", "");
    slug = slug.trim().replaceAll("\\s+", "-");
    return slug;
  }
}
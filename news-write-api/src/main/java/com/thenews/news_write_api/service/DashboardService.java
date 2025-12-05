package com.thenews.news_write_api.service;

import com.thenews.news_write_api.dto.response.DashboardStatsResponse;
import com.thenews.news_write_api.repository.ArticleRepository;
import com.thenews.news_write_api.repository.CategoryRepository;
import com.thenews.news_write_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
  private final ArticleRepository articleRepository;
  private final UserRepository userRepository;
  private final CategoryRepository categoryRepository;

  public DashboardStatsResponse getStats() {
    long articles = articleRepository.count();
    long users = userRepository.count();
    long categories = categoryRepository.count();
    Long views = articleRepository.getTotalViews();
    if (views == null)
      views = 0L;

    return new DashboardStatsResponse(articles, users, categories, views);
  }
}
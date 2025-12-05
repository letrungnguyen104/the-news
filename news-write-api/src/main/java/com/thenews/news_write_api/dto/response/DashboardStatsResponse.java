package com.thenews.news_write_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
  private long totalArticles;
  private long totalUsers;
  private long totalCategories;
  private long totalViews;
}
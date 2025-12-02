package com.thenews.news_write_api.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArticleResponse {
  private Long id;
  private String title;
  private String slug;
  private String thumbnail;
  private String status;
  private LocalDateTime createdAt;
  private String authorName;
  private String categoryName;
  private String content;
  private Long categoryId;
}
package com.thenews.news_write_api.dto.request;

import lombok.Data;

@Data
public class CreateArticleRequest {
  private String title;
  private String content;
  private String thumbnail;
  private Long authorId;
  private Long categoryId;
}
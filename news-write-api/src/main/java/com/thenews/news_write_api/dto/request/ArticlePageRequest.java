package com.thenews.news_write_api.dto.request;

import lombok.Data;

@Data
public class ArticlePageRequest {
  private Integer pageNumber;
  private String imageUrl;
  private String content;
}
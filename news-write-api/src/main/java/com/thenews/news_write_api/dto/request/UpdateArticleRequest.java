package com.thenews.news_write_api.dto.request;

import com.thenews.common.entity.Article;
import lombok.Data;

@Data
public class UpdateArticleRequest {
  private String title;
  private String content;
  private String thumbnail;
  private Article.Status status;
  private Long categoryId;
}
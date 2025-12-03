package com.thenews.news_write_api.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class UpdateArticleRequest {
  private String title;
  private String shortDescription;
  private String content;
  private String thumbnail;
  private com.thenews.common.entity.Article.Status status;
  private Long categoryId;

  private List<ArticlePageRequest> pages;
}
package com.thenews.news_write_api.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CreateArticleRequest {
  private String title;
  private String shortDescription;
  private String content;
  private String thumbnail;
  private Long categoryId;
  private Long authorId;

  private List<ArticlePageRequest> pages;
}
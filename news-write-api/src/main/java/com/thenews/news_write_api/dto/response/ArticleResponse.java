package com.thenews.news_write_api.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

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

  private String shortDescription;
  private List<PageResponse> pages;

  @Data
  public static class PageResponse {
    private Long id;
    private Integer pageNumber;
    private String imageUrl;
    private String content;
  }
}
package com.thenews.common.dto;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class ArticleCacheDto implements Serializable {
  private Long id;
  private String title;
  private String slug;
  private String thumbnail;
  private String shortDescription;
  private String content;
  private String status;
  private LocalDateTime createdAt;
  private String authorName;
  private String categoryName;

  private List<PageDto> pages;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class PageDto implements Serializable {
    private Integer pageNumber;
    private String imageUrl;
    private String content;
  }
}
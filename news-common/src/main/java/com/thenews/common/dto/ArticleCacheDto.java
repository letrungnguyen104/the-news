package com.thenews.common.dto;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class ArticleCacheDto implements Serializable {
  private Long id;
  private String title;
  private String slug;
  private String content;
  private String thumbnail;
  private String status;
  private LocalDateTime createdAt;
  private String authorName;
}
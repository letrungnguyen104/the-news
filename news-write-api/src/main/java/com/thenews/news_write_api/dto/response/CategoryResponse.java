package com.thenews.news_write_api.dto.response;

import lombok.Data;

@Data
public class CategoryResponse {
  private Long id;
  private String name;
  private String slug;
}
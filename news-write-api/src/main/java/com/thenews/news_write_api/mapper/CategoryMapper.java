package com.thenews.news_write_api.mapper;

import org.mapstruct.Mapper;

import com.thenews.common.entity.Category;
import com.thenews.news_write_api.dto.response.CategoryResponse;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
  CategoryResponse toResponse(Category category);
}

package com.thenews.news_write_api.mapper;

import com.thenews.common.entity.Article;
import com.thenews.news_write_api.dto.request.CreateArticleRequest;
import com.thenews.news_write_api.dto.request.UpdateArticleRequest;
import com.thenews.news_write_api.dto.response.ArticleResponse;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ArticleMapper {

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "slug", ignore = true)
  @Mapping(target = "status", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "author", ignore = true)
  @Mapping(target = "category", ignore = true)
  Article toEntity(CreateArticleRequest request);

  @Mapping(target = "authorName", source = "author.username")
  @Mapping(target = "categoryId", source = "category.id")
  @Mapping(target = "categoryName", source = "category.name")
  ArticleResponse toResponse(Article article);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateArticleFromRequest(UpdateArticleRequest request, @MappingTarget Article article);
}
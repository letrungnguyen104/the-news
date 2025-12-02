package com.thenews.news_write_api.mapper;

import com.thenews.common.entity.User;
import com.thenews.news_write_api.dto.request.CreateUserRequest;
import com.thenews.news_write_api.dto.request.UpdateUserRequest;
import com.thenews.news_write_api.dto.response.UserResponse;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UserMapper {
  User toEntity(CreateUserRequest request);

  UserResponse toResponse(User user);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateUserFromRequest(UpdateUserRequest request, @MappingTarget User user);
}
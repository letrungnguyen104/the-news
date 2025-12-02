package com.thenews.news_write_api.dto.request;

import com.thenews.common.entity.User;
import lombok.Data;

@Data
public class UpdateUserRequest {
  private String email;
  private User.Role role;
}
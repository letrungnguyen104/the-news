package com.thenews.news_write_api.dto.request;

import com.thenews.common.entity.User;
import lombok.Data;

@Data
public class CreateUserRequest {
  private String username;
  private String email;
  private String password;
  private User.Role role;
}
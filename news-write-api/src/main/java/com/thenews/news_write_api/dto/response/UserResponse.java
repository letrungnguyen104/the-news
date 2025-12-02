package com.thenews.news_write_api.dto.response;

import com.thenews.common.entity.User;
import lombok.Data;

@Data
public class UserResponse {
  private Long id;
  private String username;
  private String email;
  private User.Role role;
}
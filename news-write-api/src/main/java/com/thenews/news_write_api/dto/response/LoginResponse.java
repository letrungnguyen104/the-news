package com.thenews.news_write_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
  private String accessToken;
  private String tokenType = "Bearer";

  public LoginResponse(String accessToken) {
    this.accessToken = accessToken;
  }
}
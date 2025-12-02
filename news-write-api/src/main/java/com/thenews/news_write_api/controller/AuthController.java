package com.thenews.news_write_api.controller;

import com.thenews.news_write_api.dto.request.CreateUserRequest;
import com.thenews.news_write_api.dto.request.LoginRequest;
import com.thenews.news_write_api.dto.response.LoginResponse;
import com.thenews.news_write_api.dto.response.UserResponse;
import com.thenews.news_write_api.security.JwtTokenProvider;
import com.thenews.news_write_api.service.UserAdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider tokenProvider;
  private final UserAdminService userAdminService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getUsername(),
            loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    String jwt = tokenProvider.generateToken(authentication);
    return ResponseEntity.ok(new LoginResponse(jwt));
  }

  @PostMapping("/register")
  public ResponseEntity<UserResponse> registerUser(@RequestBody CreateUserRequest request) {
    return ResponseEntity.ok(userAdminService.createUser(request));
  }
}
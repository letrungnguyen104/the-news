package com.thenews.news_write_api.controller;

import com.thenews.news_write_api.dto.request.CreateUserRequest;
import com.thenews.news_write_api.dto.request.UpdateUserRequest;
import com.thenews.news_write_api.dto.response.UserResponse;
import com.thenews.news_write_api.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class UserAdminController {

  private final UserAdminService userAdminService;

  @PostMapping
  public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
    return ResponseEntity.ok(userAdminService.createUser(request));
  }

  @GetMapping
  public ResponseEntity<List<UserResponse>> getAllUsers() {
    return ResponseEntity.ok(userAdminService.getAllUsers());
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
    return ResponseEntity.ok(userAdminService.getUserById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
    return ResponseEntity.ok(userAdminService.updateUser(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userAdminService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }
}
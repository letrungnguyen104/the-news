package com.thenews.news_write_api.service;

import com.thenews.common.entity.User;
import com.thenews.news_write_api.dto.request.CreateUserRequest;
import com.thenews.news_write_api.dto.request.UpdateUserRequest;
import com.thenews.news_write_api.dto.response.UserResponse;
import com.thenews.news_write_api.mapper.UserMapper;
import com.thenews.news_write_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAdminService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  public UserResponse createUser(CreateUserRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already exists");
    }
    User user = userMapper.toEntity(request);
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    return userMapper.toResponse(userRepository.save(user));
  }

  public List<UserResponse> getAllUsers() {
    return userRepository.findAll().stream()
        .map(userMapper::toResponse)
        .collect(Collectors.toList());
  }

  public UserResponse getUserById(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    return userMapper.toResponse(user);
  }

  @Transactional
  public UserResponse updateUser(Long id, UpdateUserRequest request) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));

    userMapper.updateUserFromRequest(request, user);
    return userMapper.toResponse(userRepository.save(user));
  }

  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }
}
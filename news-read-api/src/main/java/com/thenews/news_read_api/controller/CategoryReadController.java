package com.thenews.news_read_api.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thenews.news_read_api.dto.CategoryDto;
import com.thenews.news_read_api.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryReadController {
  private final CategoryRepository categoryRepository;

  @GetMapping
  public ResponseEntity<List<CategoryDto>> getAll() {
    List<CategoryDto> list = categoryRepository.findAll().stream()
        .map(cat -> new CategoryDto(cat.getId(), cat.getName(), cat.getSlug()))
        .collect(Collectors.toList());

    return ResponseEntity.ok(list);
  }
}

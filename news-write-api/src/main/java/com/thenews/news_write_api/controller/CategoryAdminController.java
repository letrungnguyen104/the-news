package com.thenews.news_write_api.controller;

import com.thenews.cache.service.RedisCacheService;
import com.thenews.common.entity.Category;
import com.thenews.news_write_api.dto.response.CategoryResponse;
import com.thenews.news_write_api.mapper.CategoryMapper;
import com.thenews.news_write_api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class CategoryAdminController {

  private final CategoryRepository categoryRepository;
  private final CategoryMapper categoryMapper;
  private final RedisCacheService redisCacheService;

  @GetMapping
  public ResponseEntity<List<CategoryResponse>> getAll() {
    List<CategoryResponse> list = categoryRepository.findAll().stream()
        .map(categoryMapper::toResponse)
        .collect(Collectors.toList());
    return ResponseEntity.ok(list);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Category> getById(@PathVariable Long id) {
    return categoryRepository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Category> create(@RequestBody Category category) {
    if (category.getSlug() == null || category.getSlug().isEmpty()) {
      category.setSlug(toSlug(category.getName()));
    }
    Category categorySaved = categoryRepository.save(category);
    redisCacheService.delete("categories:all");
    return ResponseEntity.ok(categorySaved);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category request) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Category not found"));

    category.setName(request.getName());
    category.setSlug(toSlug(request.getName()));
    Category categorySaved = categoryRepository.save(category);
    redisCacheService.delete("categories:all");

    return ResponseEntity.ok(categorySaved);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    if (!categoryRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    categoryRepository.deleteById(id);
    redisCacheService.delete("categories:all");
    return ResponseEntity.noContent().build();
  }

  private String toSlug(String input) {
    if (input == null)
      return "";
    String slug = input.toLowerCase();
    slug = Normalizer.normalize(slug, Normalizer.Form.NFD);
    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    slug = pattern.matcher(slug).replaceAll("");
    slug = slug.replace("đ", "d");
    slug = slug.replaceAll("[^a-z0-9\\s-]", "");
    slug = slug.trim().replaceAll("\\s+", "-");

    return slug;
  }
}
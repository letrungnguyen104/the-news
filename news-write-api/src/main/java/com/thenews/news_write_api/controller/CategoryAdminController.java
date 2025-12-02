package com.thenews.news_write_api.controller;

import com.thenews.common.entity.Category;
import com.thenews.news_write_api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class CategoryAdminController {

  private final CategoryRepository categoryRepository;

  @GetMapping
  public ResponseEntity<List<Category>> getAll() {
    return ResponseEntity.ok(categoryRepository.findAll());
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
    return ResponseEntity.ok(categoryRepository.save(category));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category request) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Category not found"));

    category.setName(request.getName());
    category.setSlug(toSlug(request.getName()));

    return ResponseEntity.ok(categoryRepository.save(category));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    if (!categoryRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    categoryRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  private String toSlug(String input) {
    return input.toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replace(" ", "-");
  }
}
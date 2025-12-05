package com.thenews.news_write_api.repository;

import com.thenews.common.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
  Optional<Article> findBySlug(String slug);

  boolean existsBySlug(String slug);

  @Query("SELECT SUM(a.views) FROM Article a")
  Long getTotalViews();
}
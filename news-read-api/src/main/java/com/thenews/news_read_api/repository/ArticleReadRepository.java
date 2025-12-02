package com.thenews.news_read_api.repository;

import com.thenews.common.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleReadRepository extends JpaRepository<Article, Long> {
  Optional<Article> findBySlugAndStatus(String slug, Article.Status status);
}
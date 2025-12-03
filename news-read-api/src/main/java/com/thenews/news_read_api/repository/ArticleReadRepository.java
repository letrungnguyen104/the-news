package com.thenews.news_read_api.repository;

import com.thenews.common.entity.Article;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleReadRepository extends JpaRepository<Article, Long> {
  @EntityGraph(attributePaths = { "author", "category", "pages" })
  Optional<Article> findBySlugAndStatus(String slug, Article.Status status);

  @EntityGraph(attributePaths = { "author", "category" })
  List<Article> findAllByStatusOrderByCreatedAtDesc(Article.Status status);

  @EntityGraph(attributePaths = { "author", "category" })
  List<Article> findAllByCategory_SlugAndStatusOrderByCreatedAtDesc(String categorySlug, Article.Status status);

  @EntityGraph(attributePaths = { "author", "category" })
  List<Article> findTop4ByCategory_IdAndIdNotOrderByCreatedAtDesc(Long categoryId, Long articleId);
}
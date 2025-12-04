package com.thenews.news_read_api.repository;

import com.thenews.common.entity.Article;
import org.springframework.data.domain.Pageable; // Import thêm
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import thêm
import org.springframework.data.repository.query.Param; // Import thêm
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleReadRepository extends JpaRepository<Article, Long> {

  @Query("SELECT a FROM Article a LEFT JOIN FETCH a.author LEFT JOIN FETCH a.category LEFT JOIN FETCH a.pages WHERE a.slug = :slug AND a.status = :status")
  Optional<Article> findBySlugAndStatus(@Param("slug") String slug, @Param("status") Article.Status status);

  @Query("SELECT a FROM Article a LEFT JOIN FETCH a.author LEFT JOIN FETCH a.category WHERE a.status = :status ORDER BY a.createdAt DESC")
  List<Article> findAllByStatusOrderByCreatedAtDesc(@Param("status") Article.Status status);

  @Query("SELECT a FROM Article a LEFT JOIN FETCH a.author LEFT JOIN FETCH a.category WHERE a.category.slug = :slug AND a.status = :status ORDER BY a.createdAt DESC")
  List<Article> findAllByCategory_SlugAndStatusOrderByCreatedAtDesc(@Param("slug") String categorySlug,
      @Param("status") Article.Status status);

  @Query("SELECT a FROM Article a LEFT JOIN FETCH a.author LEFT JOIN FETCH a.category WHERE a.category.id = :catId AND a.id <> :artId ORDER BY a.createdAt DESC")
  List<Article> findRelatedArticles(@Param("catId") Long categoryId, @Param("artId") Long articleId, Pageable pageable);
}
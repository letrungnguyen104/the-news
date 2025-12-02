package com.thenews.common.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(unique = true)
  private String slug;

  @Column(columnDefinition = "TEXT")
  private String content;

  private String thumbnail;

  @Enumerated(EnumType.STRING)
  private Status status;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id")
  @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
  private User author;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "articles" })
  private Category category;

  public enum Status {
    DRAFT, PUBLISHED
  }

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
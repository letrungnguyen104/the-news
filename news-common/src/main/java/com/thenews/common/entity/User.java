package com.thenews.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String username;

  private String password;

  @Column(unique = true, nullable = false)
  private String email;

  @Enumerated(EnumType.STRING)
  private Role role;

  public enum Role {
    ADMIN, EDITOR, USER
  }
}
package com.thenews.news_read_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thenews.common.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}

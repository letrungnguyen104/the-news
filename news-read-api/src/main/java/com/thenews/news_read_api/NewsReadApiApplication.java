package com.thenews.news_read_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.thenews.common.entity")
@ComponentScan(basePackages = { "com.thenews.news_read_api", "com.thenews.cache" })
@EnableJpaRepositories(basePackages = "com.thenews.news_read_api.repository")
public class NewsReadApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(NewsReadApiApplication.class, args);
	}

}

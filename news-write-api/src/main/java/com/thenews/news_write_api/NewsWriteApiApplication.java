package com.thenews.news_write_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.thenews.common.entity")
@EnableJpaRepositories(basePackages = "com.thenews.news_write_api.repository")
public class NewsWriteApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(NewsWriteApiApplication.class, args);
	}

}

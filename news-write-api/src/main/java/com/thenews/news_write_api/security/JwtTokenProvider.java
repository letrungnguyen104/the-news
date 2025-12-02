package com.thenews.news_write_api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
  private static final String JWT_SECRET = "5TmY1RELpmhJ5lXAF6AQNfhve0WXCNKh3cD1s38etdpQBdlHtY/x0UL1bvPlZs2b";

  private static final long JWT_EXPIRATION = 86400000L;

  private Key getSigningKey() {
    return Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
  }

  public String generateToken(Authentication authentication) {
    String username = authentication.getName();
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(getSigningKey(), SignatureAlgorithm.HS512)
        .compact();
  }

  public String getUsernameFromJWT(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  public boolean validateToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
      return true;
    } catch (JwtException | IllegalArgumentException ex) {
    }
    return false;
  }
}
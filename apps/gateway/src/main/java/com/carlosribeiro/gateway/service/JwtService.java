package com.carlosribeiro.gateway.service;

import com.carlosribeiro.gateway.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    @Value("${app.gateway.security.token.secret}")
    private String secret;

    @Value("${app.gateway.security.token.expiration}")
    private String accessTokenExpiration;

    public String generateAccessToken(User user) {
        final long tokenExpiration = Long.parseLong(accessTokenExpiration);
        return generateToken(user, tokenExpiration);
    }

    private String generateToken(User user, long tokenExpiration) {
        return Jwts
                .builder()
                .subject(user.getId().toString())
                .claim("name", user.getName())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + tokenExpiration * 1000))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);

            return claims
                    .getExpiration()
                    .after(new Date());
        } catch (JwtException e) {
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserIdFromToken(String token) {
        return Long.valueOf(getClaims(token).getSubject());
    }
}

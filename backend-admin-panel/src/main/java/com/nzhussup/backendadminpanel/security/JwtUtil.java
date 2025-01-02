package com.nzhussup.backendadminpanel.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.nzhussup.backendadminpanel.config.AppConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("security.jwt.secret-key")
    private String SECRET_KEY;
    private static final long EXPIRATION_TIME = AppConfig.EXPIRATION_TIME; // 1 day in milliseconds

    public String generateToken(String username) {
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public long getExpirationTime(String token) {
        return JWT.decode(token).getClaim("exp").asLong();
    }

    public DecodedJWT validateToken(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build();
        return verifier.verify(token);
    }

    public String getUsernameFromToken(String token) {
        return validateToken(token).getSubject();
    }
}



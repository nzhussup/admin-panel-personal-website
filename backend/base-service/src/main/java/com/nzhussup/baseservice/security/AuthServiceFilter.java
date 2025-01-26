package com.nzhussup.baseservice.security;

import com.nzhussup.baseservice.config.AppConfig;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthServiceFilter implements Filter {

    private final WebClient webClient;

    public AuthServiceFilter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public void doFilter(
            jakarta.servlet.ServletRequest servletRequest,
            jakarta.servlet.ServletResponse servletResponse,
            FilterChain filterChain
    ) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Skip validation if no token is provided
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            // Call the auth-service to validate the token
            ValidationResponse validationResponse = webClient.post()
                    .uri(AppConfig.authValidationUri)
                    .bodyValue(new ValidationRequest(token))
                    .retrieve()
                    .bodyToMono(ValidationResponse.class)
                    .block(); // Synchronous call for Jakarta Servlet compatibility


            assert validationResponse != null;
            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(
                            validationResponse.getUsername(),
                            null,
                            validationResponse.getAuthorities()
                    )
            );

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: " + e.getMessage());
        }
    }

    // DTOs for ValidationRequest and ValidationResponse
    @Getter
    @Setter
    public static class ValidationRequest {
        private String token;

        public ValidationRequest(String token) {
            this.token = token;
        }
    }

    @Getter
    @Setter
    public static class ValidationResponse {
        private String username;
        private List<String> roles;

        public List<SimpleGrantedAuthority> getAuthorities() {
            return roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        }
    }
}

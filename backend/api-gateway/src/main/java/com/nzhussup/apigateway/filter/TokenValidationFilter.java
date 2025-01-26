package com.nzhussup.apigateway.filter;

import lombok.*;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class TokenValidationFilter implements GlobalFilter, Ordered {

    private final WebClient webClient;

    public TokenValidationFilter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        String token = authHeader.substring(7);

        return webClient.post()
                .uri("http://auth-service/auth/validate")
                .bodyValue(new ValidationRequest(token))
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse -> clientResponse.bodyToMono(String.class)
                        .flatMap(errorBody -> Mono.error(new RuntimeException("Access denied: " + errorBody))))
                .bodyToMono(ValidationResponse.class)
                .flatMap(validationResponse -> {
                    System.out.println("Token validated. Username: " + validationResponse.getUsername());

                    // Ensure roles are not null
                    List<String> roles = validationResponse.getRoles();
                    if (roles == null) {
                        roles = List.of();
                    }

                    // Add user details to the request headers
                    exchange.getRequest().mutate()
                            .header("X-User-Username", validationResponse.getUsername())
                            .header("X-User-Roles", String.join(",", roles))
                            .build();

                    // Proceed with the filter chain
                    return chain.filter(exchange);
                })
                .onErrorResume(throwable -> {
                    // Handle errors here: set HTTP 401 Unauthorized and complete the response
                    System.out.println("Error during token validation: " + throwable.getMessage());
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });

    }


    @Override
    public int getOrder() {
        return -1;
    }


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

        public ValidationResponse(String username, List<String> roles) {
            this.username = username;
            this.roles = roles != null ? roles : List.of();
        }
    }

}

package com.nzhussup.apigateway.routes;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Router {

        @Bean
        public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                // BASE SERVICE
                                .route("base-service-swagger", r -> r.path("/v1/base/**")
                                                .uri("lb://base-service"))

                                // USER SERVICE
                                .route("user-service", r -> r.path("/v1/user/**")
                                                .uri("lb://user-service"))

                                // AUTH SERVICE
                                .route("auth-service", r -> r.path("/auth/**")
                                                .uri("lb://auth-service"))

                                // IMAGE SERVICE
                                .route("image-service", r -> r.path("/v1/album/**")
                                                .uri("lb://image-service"))

                                // DISCOVERY SERVER
                                .route("discovery-server", route -> route
                                                .path("/eureka")
                                                .filters(f -> f.rewritePath("/eureka", "/"))
                                                .uri("http://discovery-server:8761"))
                                .route("discovery-server-lastn", route -> route
                                                .path("/lastn")
                                                .uri("http://discovery-server:8761"))
                                .route("discovery-server-static", route -> route
                                                .path("/eureka/**")
                                                .uri("http://discovery-server:8761"))

                                // WEDDING SERVICE
                                .route("wedding-backend-service", r -> r.path("/api/v1/wedding/**")
                                                .uri("lb://wedding-backend-service"))

                                .build();
        }
}

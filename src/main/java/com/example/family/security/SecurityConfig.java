package com.example.family.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Spring Security configuration for PariVaar.
 *
 * Rules: - POST /auth/** → public (Google login endpoint) - GET /hello → public
 * (health-check, can be removed later) - Everything else → requires a valid JWT
 * in the Authorization header
 *
 * Sessions are STATELESS — the JWT is the only session mechanism.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF — not needed for stateless JWT APIs
                .csrf(csrf -> csrf.disable())
                // Use our CORS config bean (allows the Vite dev frontend)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // No server-side sessions — every request must carry its JWT
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define which endpoints are public vs protected
                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() // Google login
                .requestMatchers("/hello").permitAll() // Health check
                .anyRequest().authenticated() // Everything else needs JWT
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpStatus.UNAUTHORIZED.value())))
                // Register JwtFilter BEFORE Spring's default username/password filter
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS config — allows the React frontend (Vite on port 5173 or any origin)
     * to call the backend with Authorization headers.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));   // tighten in production
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

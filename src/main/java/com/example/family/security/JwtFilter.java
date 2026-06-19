package com.example.family.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Runs once per HTTP request.
 * Reads "Authorization: Bearer <token>" from the request header,
 * validates the JWT, and populates Spring Security's SecurityContext
 * so that any controller can call SecurityContextHolder.getContext()
 * .getAuthentication().getPrincipal() to get the logged-in user's email.
 */
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Read the Authorization header
        String authHeader = request.getHeader("Authorization");
        log.info("JwtFilter: incoming request to URI: {}, method: {}, Authorization header: {}", 
                 request.getRequestURI(), request.getMethod(), authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 2. Extract the raw token (strip "Bearer " prefix)
            String token = authHeader.substring(7);

            // 3. Validate and populate security context
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);

                // Put the authenticated principal into Spring's SecurityContext
                // (no password or roles needed — we trust our own JWT)
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 4. Always continue the filter chain
        filterChain.doFilter(request, response);
    }
}

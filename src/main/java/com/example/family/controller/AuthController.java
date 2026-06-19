package com.example.family.controller;

import com.example.family.dto.GoogleAuthRequest;
import com.example.family.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.example.family.model.UserLogin;
import com.example.family.repository.UserLoginRepository;
import com.example.family.service.AsyncAuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Value("${google.client.id}")
    private String googleClientId;

    @Autowired
    private UserLoginRepository userLoginRepository;

    @Autowired
    private AsyncAuditService asyncAuditService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogle(@RequestBody GoogleAuthRequest request) {
        String mainThread = Thread.currentThread().getName();
        log.info("[HTTP THREAD] Received Google Auth Request | Thread: {}", mainThread);

        try {
            // Verify the token sent from the frontend
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                // You can extract user details here
                String email = payload.getEmail();
                String firstName = (String) payload.get("given_name");
                String lastName = (String) payload.get("family_name");
                
                // Record the login in the database
                UserLogin loginRecord = new UserLogin(email, firstName, lastName, LocalDateTime.now());
                userLoginRepository.save(loginRecord);
                
                // ASYNC TRIGGER: Hand off audit log creation to a background thread
                asyncAuditService.logActivityAsync("GOOGLE_AUTH", 
                        "User " + firstName + " " + lastName + " (" + email + ") logged in.");
                
                // Generate our own backend JWT (signed with our secret)
                // This replaces the Google token — JwtFilter will validate this token
                String backendJwt = jwtUtil.generateToken(email);

                Map<String, Object> response = new HashMap<>();
                response.put("token", backendJwt);  // backend-issued JWT
                response.put("email", email);
                response.put("firstName", firstName);
                response.put("lastName", lastName);

                log.info("[HTTP THREAD] Completed Auth request and returning response | Thread: {}", mainThread);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google ID token.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication error: " + e.getMessage());
        }
    }
}

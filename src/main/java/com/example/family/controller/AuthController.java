package com.example.family.controller;

import com.example.family.dto.GoogleAuthRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.example.family.model.UserLogin;
import com.example.family.repository.UserLoginRepository;
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
@CrossOrigin(origins = "*") // Allows your frontend to call this API
public class AuthController {

    @Value("${google.client.id}")
    private String googleClientId;

    @Autowired
    private UserLoginRepository userLoginRepository;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogle(@RequestBody GoogleAuthRequest request) {
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
                
                // TODO: Generate your own backend JWT instead of reusing Google's

                Map<String, Object> response = new HashMap<>();
                // For now, we are just returning the Google token to act as our session token
                response.put("token", request.getToken()); 
                response.put("email", email);
                response.put("firstName", firstName);
                response.put("lastName", lastName);

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

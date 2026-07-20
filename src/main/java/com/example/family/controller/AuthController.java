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

import com.example.family.model.User;
import com.example.family.repository.UserRepository;
import com.example.family.dto.SignupRequest;
import com.example.family.dto.SigninRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

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
                
                // Record the login in the database: update loginTime if exists, else create new record
                UserLogin loginRecord = userLoginRepository.findFirstByEmail(email)
                        .map(existingRecord -> {
                            existingRecord.setLoginTime(LocalDateTime.now());
                            existingRecord.setFirstName(firstName);
                            existingRecord.setLastName(lastName);
                            return existingRecord;
                        })
                        .orElseGet(() -> new UserLogin(email, firstName, lastName, LocalDateTime.now()));
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

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        log.info("[HTTP THREAD] Received Custom Signup Request for email: {}", request.getEmail());
        try {
            if (request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body("Email and password are required.");
            }

            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email is already registered.");
            }

            String encodedPassword = passwordEncoder.encode(request.getPassword());
            User user = new User(request.getEmail(), encodedPassword, request.getFirstName(), request.getLastName(), request.getPhoneNumber());
            userRepository.save(user);

            // Record the login in the database
            UserLogin loginRecord = userLoginRepository.findFirstByEmail(request.getEmail())
                    .map(existingRecord -> {
                        existingRecord.setLoginTime(LocalDateTime.now());
                        existingRecord.setFirstName(request.getFirstName());
                        existingRecord.setLastName(request.getLastName());
                        return existingRecord;
                    })
                    .orElseGet(() -> new UserLogin(request.getEmail(), request.getFirstName(), request.getLastName(), LocalDateTime.now()));
            userLoginRepository.save(loginRecord);

            asyncAuditService.logActivityAsync("USER_SIGNUP",
                    "User " + request.getFirstName() + " " + request.getLastName() + " (" + request.getEmail() + ") registered and logged in.");

            String backendJwt = jwtUtil.generateToken(request.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", backendJwt);
            response.put("email", request.getEmail());
            response.put("firstName", request.getFirstName());
            response.put("lastName", request.getLastName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup error: " + e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody SigninRequest request) {
        log.info("[HTTP THREAD] Received Custom Signin Request for email: {}", request.getEmail());
        try {
            if (request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body("Email and password are required.");
            }

            java.util.Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
            }

            User user = userOpt.get();

            // Record the login in the database
            UserLogin loginRecord = userLoginRepository.findFirstByEmail(user.getEmail())
                    .map(existingRecord -> {
                        existingRecord.setLoginTime(LocalDateTime.now());
                        existingRecord.setFirstName(user.getFirstName());
                        existingRecord.setLastName(user.getLastName());
                        return existingRecord;
                    })
                    .orElseGet(() -> new UserLogin(user.getEmail(), user.getFirstName(), user.getLastName(), LocalDateTime.now()));
            userLoginRepository.save(loginRecord);

            asyncAuditService.logActivityAsync("USER_SIGNIN",
                    "User " + user.getFirstName() + " " + user.getLastName() + " (" + user.getEmail() + ") logged in.");

            String backendJwt = jwtUtil.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", backendJwt);
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signin error: " + e.getMessage());
        }
    }
}

package com.brelinx.move.controllers;

import com.brelinx.move.dto.AuthResponse;
import com.brelinx.move.models.User;
import com.brelinx.move.repositories.UserRepository;
import com.brelinx.move.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class OAuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    @Value("${google.client.id}")
    private String googleClientId;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String idTokenString = body.get("idToken");
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                return ResponseEntity.status(401).body("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name != null ? name : email);
                newUser.setPassword("GOOGLE_OAUTH");
                newUser.setRole("rider");
                return userRepository.save(newUser);
            });

            String token = jwtUtil.generateToken(user.getEmail(), user.getId());
            return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("OAuth verification failed");
        }
    }
}

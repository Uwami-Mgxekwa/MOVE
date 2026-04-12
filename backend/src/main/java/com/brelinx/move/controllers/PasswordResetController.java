package com.brelinx.move.controllers;

import com.brelinx.move.models.User;
import com.brelinx.move.repositories.UserRepository;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth/reset")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.verify.service.sid}")
    private String verifyServiceSid;

    // Step 1: send OTP to phone number linked to account
    @PostMapping("/send")
    public ResponseEntity<?> sendReset(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        Optional<User> user = userRepository.findAll().stream()
                .filter(u -> phone.equals(u.getPhone())).findFirst();
        if (user.isEmpty()) {
            return ResponseEntity.ok(Map.of("sent", true)); // don't reveal if phone exists
        }
        try {
            Twilio.init(accountSid, authToken);
            Verification.creator(verifyServiceSid, phone, "sms").create();
            return ResponseEntity.ok(Map.of("sent", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Step 2: verify OTP + set new password
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmReset(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code");
        String newPassword = body.get("newPassword");

        try {
            Twilio.init(accountSid, authToken);
            VerificationCheck check = VerificationCheck.creator(verifyServiceSid)
                    .setTo(phone).setCode(code).create();

            if (!"approved".equals(check.getStatus())) {
                return ResponseEntity.ok(Map.of("success", false, "error", "Invalid code"));
            }

            userRepository.findAll().stream()
                    .filter(u -> phone.equals(u.getPhone())).findFirst()
                    .ifPresent(u -> {
                        u.setPassword(passwordEncoder.encode(newPassword));
                        userRepository.save(u);
                    });

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}

package com.brelinx.move.controllers;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.verify.service.sid}")
    private String verifyServiceSid;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number required"));
        }
        try {
            Twilio.init(accountSid, authToken);
            Verification.creator(verifyServiceSid, phone, "sms").create();
            return ResponseEntity.ok(Map.of("sent", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code");
        try {
            Twilio.init(accountSid, authToken);
            VerificationCheck check = VerificationCheck.creator(verifyServiceSid)
                    .setTo(phone).setCode(code).create();
            boolean verified = "approved".equals(check.getStatus());
            return ResponseEntity.ok(Map.of("verified", verified));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("verified", false, "error", e.getMessage()));
        }
    }
}

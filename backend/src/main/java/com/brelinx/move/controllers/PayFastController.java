package com.brelinx.move.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payments/payfast")
@CrossOrigin(origins = "*")
public class PayFastController {

    @Value("${payfast.merchant.id}")
    private String merchantId;

    @Value("${payfast.merchant.key}")
    private String merchantKey;

    @Value("${payfast.passphrase}")
    private String passphrase;

    @Value("${payfast.sandbox:true}")
    private boolean sandbox;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generatePayment(@RequestBody Map<String, Object> body) {
        try {
            String amount = new BigDecimal(body.get("amount").toString())
                    .setScale(2, java.math.RoundingMode.HALF_UP).toPlainString();
            String itemName = body.getOrDefault("itemName", "MOVE Ride").toString();
            String returnUrl = body.getOrDefault("returnUrl", "http://localhost:5173/payment/success").toString();
            String cancelUrl = body.getOrDefault("cancelUrl", "http://localhost:5173/payment/cancel").toString();
            String notifyUrl = body.getOrDefault("notifyUrl", "http://localhost:8080/payments/payfast/notify").toString();

            LinkedHashMap<String, String> params = new LinkedHashMap<>();
            params.put("merchant_id", merchantId);
            params.put("merchant_key", merchantKey);
            params.put("return_url", returnUrl);
            params.put("cancel_url", cancelUrl);
            params.put("notify_url", notifyUrl);
            params.put("amount", amount);
            params.put("item_name", itemName);

            // Generate signature
            String queryString = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + urlEncode(e.getValue()))
                    .collect(Collectors.joining("&"));
            queryString += "&passphrase=" + urlEncode(passphrase);
            String signature = md5(queryString);
            params.put("signature", signature);

            String host = sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process";

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("paymentUrl", host);
            response.put("params", params);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/notify")
    public ResponseEntity<String> notify(@RequestBody Map<String, String> payload) {
        // PayFast ITN (Instant Transaction Notification) handler
        // Verify and update payment status here
        return ResponseEntity.ok("OK");
    }

    private String urlEncode(String value) {
        try {
            return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
        } catch (Exception e) {
            return value;
        }
    }

    private String md5(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}

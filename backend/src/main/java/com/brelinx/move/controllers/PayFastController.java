package com.brelinx.move.controllers;

import com.brelinx.move.models.Payment;
import com.brelinx.move.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired private PaymentRepository paymentRepository;

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
            String returnUrl = body.getOrDefault("returnUrl", "http://localhost:5173").toString();
            String cancelUrl = body.getOrDefault("cancelUrl", "http://localhost:5173").toString();
            String notifyUrl = "https://your-backend-domain.com/payments/payfast/notify";

            LinkedHashMap<String, String> params = new LinkedHashMap<>();
            params.put("merchant_id", merchantId);
            params.put("merchant_key", merchantKey);
            params.put("return_url", returnUrl);
            params.put("cancel_url", cancelUrl);
            params.put("notify_url", notifyUrl);
            params.put("amount", amount);
            params.put("item_name", itemName);

            String queryString = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + urlEncode(e.getValue()))
                    .collect(Collectors.joining("&"));
            queryString += "&passphrase=" + urlEncode(passphrase);
            params.put("signature", md5(queryString));

            String host = sandbox
                    ? "https://sandbox.payfast.co.za/eng/process"
                    : "https://www.payfast.co.za/eng/process";

            return ResponseEntity.ok(Map.of("paymentUrl", host, "params", params));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // PayFast ITN — called by PayFast server after payment
    @PostMapping("/notify")
    public ResponseEntity<String> notify(@RequestParam Map<String, String> payload) {
        String paymentStatus = payload.getOrDefault("payment_status", "");
        String itemName = payload.getOrDefault("item_name", "");

        // Extract tripId from item_name if encoded, or use m_payment_id
        String mPaymentId = payload.getOrDefault("m_payment_id", "");

        if ("COMPLETE".equals(paymentStatus)) {
            // Try to find and update payment by tripId
            try {
                if (!mPaymentId.isBlank()) {
                    Long tripId = Long.parseLong(mPaymentId);
                    paymentRepository.findByTripId(tripId).ifPresent(p -> {
                        p.setStatus("PAID");
                        paymentRepository.save(p);
                    });
                }
            } catch (NumberFormatException ignored) {}
        }
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

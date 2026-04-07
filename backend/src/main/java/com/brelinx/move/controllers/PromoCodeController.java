package com.brelinx.move.controllers;

import com.brelinx.move.models.PromoCode;
import com.brelinx.move.repositories.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/promo")
@CrossOrigin(origins = "*")
public class PromoCodeController {

    @Autowired private PromoCodeRepository promoCodeRepository;

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validate(@PathVariable String code) {
        return promoCodeRepository.findByCodeAndActiveTrue(code)
                .map(p -> ResponseEntity.ok(Map.of(
                        "valid", true,
                        "code", p.getCode(),
                        "discountPercent", p.getDiscountPercent()
                )))
                .orElse(ResponseEntity.ok(Map.of("valid", false)));
    }

    // Admin: create promo code
    @PostMapping
    public PromoCode create(@RequestBody PromoCode promo) {
        return promoCodeRepository.save(promo);
    }
}

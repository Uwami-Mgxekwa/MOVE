package com.brelinx.move.controllers;

import com.brelinx.move.models.Payment;
import com.brelinx.move.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired private PaymentRepository paymentRepository;

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        payment.setStatus("PENDING");
        return paymentRepository.save(payment);
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<Payment> getByTrip(@PathVariable Long tripId) {
        return paymentRepository.findByTripId(tripId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return paymentRepository.findById(id).map(p -> {
            p.setStatus(status);
            return ResponseEntity.ok(paymentRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }
}

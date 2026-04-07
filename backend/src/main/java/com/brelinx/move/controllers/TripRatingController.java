package com.brelinx.move.controllers;

import com.brelinx.move.models.Notification;
import com.brelinx.move.models.Trip;
import com.brelinx.move.models.TripRating;
import com.brelinx.move.repositories.NotificationRepository;
import com.brelinx.move.repositories.TripRatingRepository;
import com.brelinx.move.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ratings")
@CrossOrigin(origins = "*")
public class TripRatingController {

    @Autowired private TripRatingRepository ratingRepository;
    @Autowired private TripRepository tripRepository;
    @Autowired private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<?> rate(@RequestBody TripRating rating) {
        if (ratingRepository.existsByTripId(rating.getTripId())) {
            return ResponseEntity.badRequest().body("Trip already rated");
        }
        TripRating saved = ratingRepository.save(rating);

        // Mark trip as completed and notify
        tripRepository.findById(rating.getTripId()).ifPresent(trip -> {
            trip.setStatus("COMPLETED");
            tripRepository.save(trip);
            notificationRepository.save(new Notification(
                    rating.getRiderId(),
                    "Thanks for riding with MOVE!",
                    "Your rating has been submitted. See you next time."
            ));
        });
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getByTrip(@PathVariable Long tripId) {
        return ratingRepository.findByTripId(tripId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

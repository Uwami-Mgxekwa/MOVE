package com.brelinx.move.controllers;

import com.brelinx.move.models.Trip;
import com.brelinx.move.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "*") // For local development
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        trip.setStatus("PENDING");
        return tripRepository.save(trip);
    }

    @GetMapping("/{id}")
    public Trip getTripById(@PathVariable Long id) {
        return tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    @GetMapping("/rider/{riderId}")
    public List<Trip> getTripsByRider(@PathVariable Long riderId) {
        return tripRepository.findByRiderId(riderId);
    }

    @PutMapping("/{id}/status")
    public Trip updateTripStatus(@PathVariable Long id, @RequestParam String status) {
        Trip trip = tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        trip.setStatus(status);
        tripRepository.save(trip);

        // Push WebSocket notification to rider
        messagingTemplate.convertAndSend("/topic/trip/" + id,
                java.util.Map.of("status", status, "tripId", id));
        return trip;
    }
}

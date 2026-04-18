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
        messagingTemplate.convertAndSend("/topic/trip/" + id,
                java.util.Map.of("status", status, "tripId", id));
        return trip;
    }

    // Driver accepts trip — sets vehicle details and pushes to rider
    @PutMapping("/{id}/accept")
    public Trip acceptTrip(@PathVariable Long id, @RequestBody java.util.Map<String, Object> body) {
        Trip trip = tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        trip.setStatus("ACCEPTED");
        trip.setDriverName((String) body.getOrDefault("driverName", "Michael"));
        trip.setVehiclePlate((String) body.getOrDefault("vehiclePlate", "CA 123-456"));
        trip.setVehicleColor((String) body.getOrDefault("vehicleColor", "White"));
        trip.setVehicleBrand((String) body.getOrDefault("vehicleBrand", "Toyota Fortuner"));
        trip.setEtaMinutes((Integer) body.getOrDefault("etaMinutes", 4));
        tripRepository.save(trip);

        messagingTemplate.convertAndSend("/topic/trip/" + id, java.util.Map.of(
                "status", "ACCEPTED",
                "driverName", trip.getDriverName(),
                "vehiclePlate", trip.getVehiclePlate(),
                "vehicleColor", trip.getVehicleColor(),
                "vehicleBrand", trip.getVehicleBrand(),
                "eta", trip.getEtaMinutes()
        ));
        return trip;
    }

    @GetMapping("/{id}/details")
    public Trip getTripDetails(@PathVariable Long id) {
        return tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
    }
}

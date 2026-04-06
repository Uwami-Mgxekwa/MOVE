package com.brelinx.move.repositories;

import com.brelinx.move.models.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByRiderId(Long riderId);
    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByStatus(String status);
}

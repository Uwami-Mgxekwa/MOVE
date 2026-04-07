package com.brelinx.move.repositories;

import com.brelinx.move.models.TripRating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TripRatingRepository extends JpaRepository<TripRating, Long> {
    Optional<TripRating> findByTripId(Long tripId);
    boolean existsByTripId(Long tripId);
}

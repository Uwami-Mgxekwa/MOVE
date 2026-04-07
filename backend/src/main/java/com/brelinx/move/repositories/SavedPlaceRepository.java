package com.brelinx.move.repositories;

import com.brelinx.move.models.SavedPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedPlaceRepository extends JpaRepository<SavedPlace, Long> {
    List<SavedPlace> findByUserId(Long userId);
}

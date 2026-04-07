package com.brelinx.move.controllers;

import com.brelinx.move.models.SavedPlace;
import com.brelinx.move.repositories.SavedPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/places")
@CrossOrigin(origins = "*")
public class SavedPlaceController {

    @Autowired private SavedPlaceRepository savedPlaceRepository;

    @GetMapping("/user/{userId}")
    public List<SavedPlace> getByUser(@PathVariable Long userId) {
        return savedPlaceRepository.findByUserId(userId);
    }

    @PostMapping
    public SavedPlace save(@RequestBody SavedPlace place) {
        return savedPlaceRepository.save(place);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        savedPlaceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

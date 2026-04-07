package com.brelinx.move.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@Controller
@CrossOrigin(origins = "*")
public class TripTrackingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Driver sends location update: /app/location
    @MessageMapping("/location")
    @SendTo("/topic/trip-updates")
    public Map<String, Object> updateLocation(Map<String, Object> locationUpdate) {
        // Broadcast to all subscribers of /topic/trip-updates
        return locationUpdate;
    }

    // Push update to a specific trip's channel
    public void pushTripUpdate(Long tripId, Map<String, Object> update) {
        messagingTemplate.convertAndSend("/topic/trip/" + tripId, update);
    }
}

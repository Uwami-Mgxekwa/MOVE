package com.brelinx.move.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Controller
@CrossOrigin(origins = "*")
public class TripTrackingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Driver sends location: /app/location/{tripId}
    @MessageMapping("/location/{tripId}")
    public void updateLocation(@DestinationVariable String tripId, Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/trip/" + tripId, payload);
    }

    // Chat message: /app/chat/{tripId}
    @MessageMapping("/chat/{tripId}")
    public void sendChatMessage(@DestinationVariable String tripId, Map<String, Object> message) {
        message.put("time", LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        messagingTemplate.convertAndSend("/topic/chat/" + tripId, message);
    }

    public void pushTripUpdate(Long tripId, Map<String, Object> update) {
        messagingTemplate.convertAndSend("/topic/trip/" + tripId, update);
    }
}

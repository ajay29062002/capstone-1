package com.wecp.educationalresourcedistributionsystem.controller;

import com.wecp.educationalresourcedistributionsystem.entity.Event;
import com.wecp.educationalresourcedistributionsystem.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EducatorController {

    @Autowired
    private EventService eventService;

    @GetMapping("/api/educator/agenda")
    public ResponseEntity<List<Event>> viewEventsAgenda() {
        
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PutMapping("/api/educator/update-material/{eventId}")
    public ResponseEntity<Event> updateEventMaterial(@PathVariable Long eventId, @RequestBody Event updateEvent) {
        Event updatedEvent = eventService.updateEvent(eventId, updateEvent);
        return ResponseEntity.ok(updatedEvent);
    }
}
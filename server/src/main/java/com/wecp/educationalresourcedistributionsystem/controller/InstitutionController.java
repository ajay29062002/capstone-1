package com.wecp.educationalresourcedistributionsystem.controller;

import com.wecp.educationalresourcedistributionsystem.entity.Event;
import com.wecp.educationalresourcedistributionsystem.entity.Resource;
import com.wecp.educationalresourcedistributionsystem.service.EventService;
import com.wecp.educationalresourcedistributionsystem.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class InstitutionController {

    @Autowired
    private EventService eventService;

    @Autowired
    private ResourceService resourceService;

    @PostMapping("/api/institution/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event createdEvent = eventService.createEvent(event);
        return new ResponseEntity<Event>(createdEvent, HttpStatus.OK);
    }

    @GetMapping("/api/institution/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PostMapping("/api/institution/resource")
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource createdResource = resourceService.createResource(resource);
       
        return new ResponseEntity<>(createdResource,HttpStatus.CREATED);
    }

    @GetMapping("/api/institution/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    @PostMapping("/api/institution/event/allocate-resources")
    public ResponseEntity<Event> allocateResource(@RequestParam("eventId") Long eventId,
                                                  @RequestParam("resourceId") Long resourceId) {
        Event updatedEvent = eventService.allocateResourceToEvent(eventId, resourceId);
        return new ResponseEntity<Event>(updatedEvent, HttpStatus.OK);
    }
}


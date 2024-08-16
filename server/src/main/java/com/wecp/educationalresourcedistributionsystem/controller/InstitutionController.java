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
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/api/institution/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/api/institution/events/sorted")
    public ResponseEntity<List<Event>> getAllEventsSortedByName(
            @RequestParam(defaultValue = "true") boolean ascending) {
        List<Event> events = eventService.getAllEventsSortedByName(ascending);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping("/api/institution/resource")
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource createdResource = resourceService.createResource(resource);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping("/api/institution/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    @GetMapping("/api/institution/resources/sorted")
    public ResponseEntity<List<Resource>> getAllResourcesSortedByDescription(
            @RequestParam(defaultValue = "true") boolean ascending) {
        List<Resource> resources = resourceService.getAllResourcesSortedByDescription(ascending);
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    @PostMapping("/api/institution/event/allocate-resources")
    public ResponseEntity<Event> allocateResource(@RequestParam("eventId") Long eventId,
            @RequestParam("resourceId") Long resourceId) {
        Event event = eventService.allocateResourceToEvent(eventId, resourceId);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @DeleteMapping("/api/institution/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/api/institution/resources/{resourceId}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long resourceId) {
        resourceService.deleteResource(resourceId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}

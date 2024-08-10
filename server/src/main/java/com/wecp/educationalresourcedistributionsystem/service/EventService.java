package com.wecp.educationalresourcedistributionsystem.service;

import com.wecp.educationalresourcedistributionsystem.entity.Event;
import com.wecp.educationalresourcedistributionsystem.entity.Resource;
import com.wecp.educationalresourcedistributionsystem.repository.EventRepository;
import com.wecp.educationalresourcedistributionsystem.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event updateEvent(Long eventId, Event updateEvent) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        event.setDescription(updateEvent.getDescription());
        event.setMaterials(updateEvent.getMaterials());
        event.setName(updateEvent.getName());
        event.setRegistrations(updateEvent.getRegistrations());
        event.setResourceAllocations(updateEvent.getResourceAllocations());
        return eventRepository.save(event);
    }

    public Event allocateResourceToEvent(Long eventId, Long resourceId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found"));


        // if (event.getResourceAllocations() == null) {
        //     event.setResourceAllocations(new ArrayList<>());
        // }

       // resource.setEvent(event);
       event.getResourceAllocations().add(resource);
       

      
        return eventRepository.save(event);




        // Event event1 = new Event();
		// event1.setName(event.getName());
		// event1.setDescription(event.getDescription());
		// event1.setResourceAllocations(event.getResourceAllocations());
		// event1 = eventRepository.save(event1);

		// // Create a sample resource object for the request body
		// Resource resource1 = new Resource();
		// resource1.setResourceType(resource.getResourceType());
		// resource1.setDescription(resource.getDescription());
		// resource1 = resourceRepository.save(resource1);

        // return eventRepository.save(event1);






    }
}
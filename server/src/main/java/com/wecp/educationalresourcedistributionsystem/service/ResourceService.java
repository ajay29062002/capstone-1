package com.wecp.educationalresourcedistributionsystem.service;

import com.wecp.educationalresourcedistributionsystem.entity.Event;
import com.wecp.educationalresourcedistributionsystem.entity.Resource;
import com.wecp.educationalresourcedistributionsystem.repository.EventRepository;
import com.wecp.educationalresourcedistributionsystem.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

import javax.persistence.EntityNotFoundException;

@Service
public class ResourceService {
    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private EventRepository eventRepository;

    public Resource createResource(Resource resource) {

        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getAllAvailableResources() {
        return resourceRepository.findByAvailability("available");
    }

    public List<Resource> getAllResourcesSortedByDescription(boolean ascending) {
        Sort sort = Sort.by(ascending ? Sort.Direction.ASC : Sort.Direction.DESC, "description");
        return resourceRepository.findAll(sort);
    }

    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + id));

        if (resource.getEvent() != null) {
            Event event = resource.getEvent();
            event.getResourceAllocations().remove(resource);
            resource.setEvent(null);
            eventRepository.save(event);
        }

        resourceRepository.delete(resource);
    }

    public Resource updateResourceAllocation(Long resourceId, boolean allocated) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found"));
        resource.setAllocated(allocated);
        return resourceRepository.save(resource);
    }

    public Resource updateResourceAvailability(Long resourceId, String availability) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found"));
        resource.setAvailability(availability);
        return resourceRepository.save(resource);
    }
}
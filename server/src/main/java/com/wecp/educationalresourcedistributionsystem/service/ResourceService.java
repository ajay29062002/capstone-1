package com.wecp.educationalresourcedistributionsystem.service;

import com.wecp.educationalresourcedistributionsystem.entity.Event;
import com.wecp.educationalresourcedistributionsystem.entity.Resource;
import com.wecp.educationalresourcedistributionsystem.repository.EventRepository;
import com.wecp.educationalresourcedistributionsystem.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private final EventRepository eventRepository ;
    private final ResourceRepository resourceRepository;


     public Resource createResource( Resource resource) {
        return resourceRepository.save(resource);
     
    }

   
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();

    }

   
    public Event allocateResource(Long eventId,Long resourceId) {
        
         Event e= eventRepository.findById(eventId).get();
        Resource r= resourceRepository.findById(resourceId).get();
         e.getResourceAllocations().add(r);
         return eventRepository.save(e);



       
    }


}



    // implement here


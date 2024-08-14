package com.wecp.educationalresourcedistributionsystem.service;

import com.wecp.educationalresourcedistributionsystem.entity.Resource;
import com.wecp.educationalresourcedistributionsystem.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {
    @Autowired
    private ResourceRepository resourceRepository;

    public Resource createResource(Resource resource) {
        
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public void deleteResource(Long resourceId) {
        resourceRepository.deleteById(resourceId);

    }
}
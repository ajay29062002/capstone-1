package com.wecp.educationalresourcedistributionsystem.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String materials;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Resource> resourceAllocations = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<EventRegistration> registrations;

    // Constructors, getters, and setters

    public Event() {
    }

    
    

    public Event(Long id, String name, String description, String materials) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.materials = materials;
    }




    public Long getId() {
        return id;
    }

  

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMaterials() {
        return materials;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public List<Resource> getResourceAllocations() {
        return resourceAllocations;
    }

    public void setResourceAllocations(List<Resource> resourceAllocations) {
        this.resourceAllocations = resourceAllocations;
    }

    public List<EventRegistration> getRegistrations() {
        return registrations;
    }

    public void setRegistrations(List<EventRegistration> registrations) {
        this.registrations = registrations;
    }
}
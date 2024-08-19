package com.wecp.educationalresourcedistributionsystem.entity;

import javax.persistence.*;

import java.time.LocalDate;
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
    private LocalDate date;

    @OneToMany(mappedBy = "event", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Resource> resourceAllocations;

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

    public List<Resource> getResourceAllocations() {
        return resourceAllocations;
    }

    public void setResourceAllocations(List<Resource> resourceAllocations) {
        this.resourceAllocations = resourceAllocations;
    }

    public String getMaterials() {
        return materials;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

}
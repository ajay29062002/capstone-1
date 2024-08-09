package com.wecp.educationalresourcedistributionsystem.entity;


import javax.persistence.*;

@Table(name = "resource_allocation") // do not change table name
@Entity
public class Resource {
    private Long id;

    private String resourceType;

    private String description;

    private Event event;

 
}


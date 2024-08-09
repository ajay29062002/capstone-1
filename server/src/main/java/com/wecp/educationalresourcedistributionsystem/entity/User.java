package com.wecp.educationalresourcedistributionsystem.entity;


import javax.persistence.*;


@Table(name = "users") // do not change table name
@Entity
public class User {

    private Long id;

   private String username;

    private String password;

    private String email;

    private String role;



    
}

package com.wecp.educationalresourcedistributionsystem.controller;

import com.wecp.educationalresourcedistributionsystem.dto.LoginRequest;
import com.wecp.educationalresourcedistributionsystem.dto.LoginResponse;
import com.wecp.educationalresourcedistributionsystem.entity.User;
import com.wecp.educationalresourcedistributionsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
       
        return new ResponseEntity<>(registeredUser,HttpStatus.CREATED);
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            LoginResponse response = new LoginResponse("token", user.getUsername(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
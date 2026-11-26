package com.carlosribeiro.gateway.controller;

import com.carlosribeiro.gateway.domain.dto.CreateUserDTO;
import com.carlosribeiro.gateway.domain.model.User;
import com.carlosribeiro.gateway.domain.util.UserInfo;
import com.carlosribeiro.gateway.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping
    public UserInfo createUser(@RequestBody @Valid CreateUserDTO createUserDTO) {
        return userService.createUser(createUserDTO);
    }
}

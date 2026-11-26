package com.carlosribeiro.gateway.service;

import com.carlosribeiro.gateway.domain.dto.CreateUserDTO;
import com.carlosribeiro.gateway.domain.model.User;
import com.carlosribeiro.gateway.domain.util.UserInfo;
import com.carlosribeiro.gateway.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserInfo createUser(CreateUserDTO userDto) {
        User createdUser = userRepository
                                .findByEmail(userDto.getEmail())
                                .orElse(null);

        if (createdUser == null) {
            User user = new User(
                    userDto.getName(),
                    userDto.getEmail(),
                    passwordEncoder.encode(userDto.getPassword())
            );

            userRepository.save(user);

            return new UserInfo(true, false, "User created with success");
        }

        return new UserInfo(false, true, "Email already exists");
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }
}

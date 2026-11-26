package com.carlosribeiro.gateway.service;

import com.carlosribeiro.gateway.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        com.carlosribeiro.gateway.domain.model.User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.emptyList());
    }
}
package com.carlosribeiro.gateway.controller;

import com.carlosribeiro.gateway.domain.dto.TokenResponseDTO;
import com.carlosribeiro.gateway.domain.dto.UserLoginDTO;
import com.carlosribeiro.gateway.domain.model.User;
import com.carlosribeiro.gateway.repository.UserRepository;
import com.carlosribeiro.gateway.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("login")
    public ResponseEntity<TokenResponseDTO> login(
            @Valid @RequestBody UserLoginDTO userLogin,
            HttpServletResponse response
    ) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLogin.getEmail(),
                        userLogin.getPassword()
                )
        );

        User user = userRepository.findByEmail(userLogin.getEmail()).orElseThrow();
        String accessToken = jwtService.generateAccessToken(user);

        return new ResponseEntity<>(new TokenResponseDTO(
                accessToken, user.getId(), user.getName()
        ), HttpStatus.OK);
    }
}

package com.carlosribeiro.gateway.domain.dto;

public record TokenResponseDTO(
        String token,
        long userId,
        String name
) {}

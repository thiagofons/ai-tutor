package com.carlosribeiro.gateway.domain.dto;

import java.time.Instant;

public record QueueRequestMessageDTO(
    String jobId,
    UserQueryRequestDTO payload,
    Instant timestamp
) {
    public QueueRequestMessageDTO(String jobId, UserQueryRequestDTO payload) {
        this(jobId, payload, Instant.now());
    }
}

package com.carlosribeiro.gateway.dto;

import java.time.Instant;

public record QueueMessageDTO(
    String jobId,
    ItemRequestDTO payload,
    Instant timestamp
) {
    public QueueMessageDTO(String jobId, ItemRequestDTO payload) {
        this(jobId, payload, Instant.now());
    }
}

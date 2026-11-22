package com.carlosribeiro.gateway.dto;

public record WorkerResponseDTO(
        String jobId,
        String status,
        Object result
) {
}

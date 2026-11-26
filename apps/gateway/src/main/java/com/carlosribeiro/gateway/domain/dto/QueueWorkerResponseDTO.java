package com.carlosribeiro.gateway.domain.dto;

import com.carlosribeiro.gateway.domain.model.LLMResult;

public record QueueWorkerResponseDTO(
        String jobId,
        String status,
        LLMResult result
) {
}

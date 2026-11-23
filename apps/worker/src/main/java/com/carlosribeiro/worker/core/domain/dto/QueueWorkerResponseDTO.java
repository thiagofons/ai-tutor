package com.carlosribeiro.worker.core.domain.dto;

import com.carlosribeiro.worker.core.domain.LLMResult;

public record QueueWorkerResponseDTO(
        String jobId,
        String status,
        LLMResult result
) {
}

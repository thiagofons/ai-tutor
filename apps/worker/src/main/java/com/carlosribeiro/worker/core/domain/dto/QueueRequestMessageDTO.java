package com.carlosribeiro.worker.core.domain.dto;

import java.time.Instant;

public record QueueRequestMessageDTO(
        String jobId,
        UserQueryRequestDTO content,
        Instant timestamp
) { }

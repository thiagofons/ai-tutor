package com.carlosribeiro.worker.core.ports.outbound;

import com.carlosribeiro.worker.core.domain.dto.LLMResultDto;

public interface QueueProducerPort {
    void sendResult(LLMResultDto result);
}

package com.carlosribeiro.worker.core.ports.outbound;

import com.carlosribeiro.worker.core.domain.LLMResult;
import com.carlosribeiro.worker.core.domain.dto.QueueRequestMessageDTO;

public interface LLMClientPort {
    LLMResult generate(QueueRequestMessageDTO query);
}

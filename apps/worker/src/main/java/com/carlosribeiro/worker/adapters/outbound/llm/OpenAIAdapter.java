package com.carlosribeiro.worker.adapters.outbound.llm;

import com.carlosribeiro.worker.core.domain.LLMResult;
import com.carlosribeiro.worker.core.domain.dto.QueueRequestMessageDTO;
import com.carlosribeiro.worker.core.ports.outbound.LLMClientPort;
import org.springframework.stereotype.Component;

@Component
public class OpenAIAdapter implements LLMClientPort {
    @Override
    public LLMResult analyze(QueueRequestMessageDTO query) {
        // TODO: Implement OpenAI call
        return null;
    }
}
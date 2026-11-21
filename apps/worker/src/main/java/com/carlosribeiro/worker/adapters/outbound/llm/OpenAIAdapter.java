package com.carlosribeiro.worker.adapters.outbound.llm;

import com.carlosribeiro.worker.core.domain.dto.InputQueryDto;
import com.carlosribeiro.worker.core.domain.dto.LLMResultDto;
import com.carlosribeiro.worker.core.ports.outbound.LLMClientPort;
import org.springframework.stereotype.Component;

@Component
public class OpenAIAdapter implements LLMClientPort {
    @Override
    public LLMResultDto analyze(InputQueryDto query) {
        return null;
    }
}

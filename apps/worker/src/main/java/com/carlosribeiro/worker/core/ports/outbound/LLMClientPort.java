package com.carlosribeiro.worker.core.ports.outbound;

import com.carlosribeiro.worker.core.domain.dto.LLMResultDto;
import com.carlosribeiro.worker.core.domain.dto.InputQueryDto;

public interface LLMClientPort {
    LLMResultDto analyze(InputQueryDto query);
}

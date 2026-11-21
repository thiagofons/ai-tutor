package com.carlosribeiro.worker.core.usecases;

import com.carlosribeiro.worker.core.domain.dto.InputQueryDto;
import com.carlosribeiro.worker.core.ports.outbound.LLMClientPort;
import com.carlosribeiro.worker.core.ports.outbound.QueueProducerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ProcessQueryUsingLLMUseCase {
    private static final Logger log = LoggerFactory.getLogger(ProcessQueryUsingLLMUseCase.class);

    private final LLMClientPort llmClientPort;
    private final QueueProducerPort queueProducerPort;

    public ProcessQueryUsingLLMUseCase(LLMClientPort llmClientPort, QueueProducerPort queueProducerPort) {
        this.llmClientPort = llmClientPort;
        this.queueProducerPort = queueProducerPort;
    }

    public void execute(InputQueryDto input) {
        // TODO: Implement use case execution
        log.info("Item processed!");
    }
}

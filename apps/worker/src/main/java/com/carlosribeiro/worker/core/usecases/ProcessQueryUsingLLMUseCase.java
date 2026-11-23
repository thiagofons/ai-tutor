package com.carlosribeiro.worker.core.usecases;

import com.carlosribeiro.worker.core.domain.LLMResult;
import com.carlosribeiro.worker.core.domain.dto.QueueRequestMessageDTO;
import com.carlosribeiro.worker.core.domain.dto.QueueWorkerResponseDTO;
import com.carlosribeiro.worker.core.ports.outbound.LLMClientPort;
import com.carlosribeiro.worker.core.ports.outbound.QueueProducerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProcessQueryUsingLLMUseCase {
    private static final Logger log = LoggerFactory.getLogger(ProcessQueryUsingLLMUseCase.class);

    private final LLMClientPort llmClientPort;
    private final QueueProducerPort queueProducerPort;

    public ProcessQueryUsingLLMUseCase(LLMClientPort llmClientPort, QueueProducerPort queueProducerPort) {
        this.llmClientPort = llmClientPort;
        this.queueProducerPort = queueProducerPort;
    }

    public void execute(QueueRequestMessageDTO input) {
        // TODO: Implement use case execution

        String jobId = UUID.randomUUID().toString();
        String status = "Ok";
        LLMResult result = new LLMResult();

        QueueWorkerResponseDTO response = new QueueWorkerResponseDTO(jobId, status, result);

        queueProducerPort.send(response);
    }
}

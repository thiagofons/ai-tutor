package com.carlosribeiro.worker.core.usecases;

import com.carlosribeiro.worker.core.domain.LLMResult;
import com.carlosribeiro.worker.core.domain.dto.QueueRequestMessageDTO;
import com.carlosribeiro.worker.core.domain.dto.QueueWorkerResponseDTO;
import com.carlosribeiro.worker.core.ports.outbound.LLMClientPort;
import com.carlosribeiro.worker.core.ports.outbound.QueueProducerPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProcessQueryUsingLLMUseCase {

    private final LLMClientPort llmClientPort;
    private final QueueProducerPort queueProducerPort;

    public ProcessQueryUsingLLMUseCase(LLMClientPort llmClientPort, QueueProducerPort queueProducerPort) {
        this.llmClientPort = llmClientPort;
        this.queueProducerPort = queueProducerPort;
    }

    public void execute(QueueRequestMessageDTO input) {
        String jobId = input.jobId();
        String status = "Ok";
        LLMResult result = llmClientPort.generate(input);

        QueueWorkerResponseDTO response = new QueueWorkerResponseDTO(jobId, status, result);

        queueProducerPort.send(response);
    }
}

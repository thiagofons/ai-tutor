package com.carlosribeiro.worker.core.ports.outbound;

import com.carlosribeiro.worker.core.domain.dto.QueueWorkerResponseDTO;

public interface QueueProducerPort {
    void send(QueueWorkerResponseDTO result);
}

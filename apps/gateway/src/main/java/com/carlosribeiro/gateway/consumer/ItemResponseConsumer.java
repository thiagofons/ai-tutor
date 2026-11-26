package com.carlosribeiro.gateway.consumer;

import com.carlosribeiro.gateway.domain.dto.QueueWorkerResponseDTO;
import com.carlosribeiro.gateway.sse.SseEmitterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ItemResponseConsumer {

    private final SseEmitterRegistry sseRegistry;

    public ItemResponseConsumer(SseEmitterRegistry sseRegistry) {
        this.sseRegistry = sseRegistry;
    }

    @RabbitListener(queues = "${app.rabbitmq.queues.output}")
    public void receive(QueueWorkerResponseDTO response) {
        log.info("Payload bruto recebido na fila output: {}", response);

        if (response != null && response.jobId() != null) {
            log.info("Response received for jobId={} response={}", response.jobId(), response.result());
            sseRegistry.sendAndComplete(response.jobId(), response);
        }
    }
}
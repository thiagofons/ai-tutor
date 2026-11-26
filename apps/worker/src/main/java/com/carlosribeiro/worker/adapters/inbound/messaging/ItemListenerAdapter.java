package com.carlosribeiro.worker.adapters.inbound.messaging;

import com.carlosribeiro.worker.core.domain.dto.QueueRequestMessageDTO;
import com.carlosribeiro.worker.core.usecases.ProcessQueryUsingLLMUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ItemListenerAdapter {

    private final ProcessQueryUsingLLMUseCase useCase;

    public ItemListenerAdapter(ProcessQueryUsingLLMUseCase useCase) {
        this.useCase = useCase;
    }

    @RabbitListener(queues = "${app.rabbitmq.queues.input}")
    public void receive(QueueRequestMessageDTO payload) {
        try {
            log.info("Received item with jobId={} for AI processing", payload.jobId());

            useCase.execute(payload);
        } catch (IllegalArgumentException e) {
            log.error("Discarded invalid payload: {}", e.getMessage());

            throw new AmqpRejectAndDontRequeueException(e);
        }
    }
}

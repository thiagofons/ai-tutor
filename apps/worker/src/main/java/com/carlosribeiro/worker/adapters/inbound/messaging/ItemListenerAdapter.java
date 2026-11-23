package com.carlosribeiro.worker.adapters.inbound.messaging;

import com.carlosribeiro.worker.core.domain.dto.QueueRequestMessageDTO;
import com.carlosribeiro.worker.core.usecases.ProcessQueryUsingLLMUseCase;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ItemListenerAdapter {
    private static final Logger log = LoggerFactory.getLogger(ItemListenerAdapter.class);

    private final ProcessQueryUsingLLMUseCase useCase;

    public ItemListenerAdapter(ProcessQueryUsingLLMUseCase useCase) {
        this.useCase = useCase;
    }

    @RabbitListener(queues = "${app.rabbitmq.queues.input}")
    public void receive(QueueRequestMessageDTO payload) {
        try {
            log.info("Received item with jobId={} for AI processing", payload.jobId());
            QueueRequestMessageDTO input = new QueueRequestMessageDTO(payload.jobId(), payload.content(), payload.timestamp());

            useCase.execute(input);
        } catch (IllegalArgumentException e) {
            log.error("Discarded invalid content: {}", e.getMessage());
            throw new AmqpRejectAndDontRequeueException(e);
        }
    }
}

package com.carlosribeiro.worker.adapters.inbound.messaging;

import com.carlosribeiro.worker.core.domain.dto.InputQueryDto;
import com.carlosribeiro.worker.core.usecases.ProcessQueryUsingLLMUseCase;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import javax.xml.validation.Validator;

@Component
public class ItemListenerAdapter {
    private static final Logger log = LoggerFactory.getLogger(ItemListenerAdapter.class);

    private final ProcessQueryUsingLLMUseCase useCase;

    public ItemListenerAdapter(ProcessQueryUsingLLMUseCase useCase) {

        this.useCase = useCase;
    }

    @RabbitListener(queues = "${app.rabbitmq.queues.input}")
    public void onMessage(InputQueryPayload payload) {
        try {
            log.info("Received item {} for AI processing", payload.id);
            InputQueryDto input = new InputQueryDto(payload.id, payload.content);
            useCase.execute(input);
        } catch (IllegalArgumentException e) {
            log.error("Discarded invalid payload: {}", e.getMessage());
            throw new AmqpRejectAndDontRequeueException(e);
        }
    }

    public record InputQueryPayload(
            @JsonProperty("id") String id,
            @JsonProperty("content") String content
    ) {}
}

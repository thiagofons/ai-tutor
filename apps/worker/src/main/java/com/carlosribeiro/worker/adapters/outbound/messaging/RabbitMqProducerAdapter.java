package com.carlosribeiro.worker.adapters.outbound.messaging;

import com.carlosribeiro.worker.core.domain.dto.LLMResultDto;
import com.carlosribeiro.worker.core.ports.outbound.QueueProducerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RabbitMqProducerAdapter implements QueueProducerPort {
    private static final Logger log = LoggerFactory.getLogger(RabbitMqProducerAdapter.class);

    private final RabbitTemplate rabbitTemplate;
    private final String outputExchange;
    private final String outputRoutingKey;

    public RabbitMqProducerAdapter(
            RabbitTemplate rabbitTemplate,
            @Value("${app.rabbitmq.exchanges.output}") String outputExchange,
            @Value("${app.rabbitmq.routing-keys.output") String outputRoutingKey
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.outputExchange = outputExchange;
        this.outputRoutingKey = outputRoutingKey;
    }

    @Override
    public void sendResult(LLMResultDto result) {
        log.info("Publish result from AI for item {}", result.itemId());

        rabbitTemplate.convertAndSend(outputExchange, outputRoutingKey, result);
    }
}

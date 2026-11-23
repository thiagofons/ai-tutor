package com.carlosribeiro.gateway.producer;

import com.carlosribeiro.gateway.domain.dto.QueueRequestMessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ItemProducer {

    private static final Logger log = LoggerFactory.getLogger(ItemProducer.class);

    private final RabbitTemplate rabbitTemplate;
    private final String inputExchange;
    private final String inputRoutingKey;

    public ItemProducer(
            RabbitTemplate rabbitTemplate,
            @Value("${app.rabbitmq.exchanges.input}") String inputExchange,
            @Value("${app.rabbitmq.routing-keys.input}") String inputRoutingKey) {
        this.rabbitTemplate = rabbitTemplate;
        this.inputExchange = inputExchange;
        this.inputRoutingKey = inputRoutingKey;
    }

    public void send(QueueRequestMessageDTO request) {
        log.info("Publish query with jobId={} in exchange={}", request.jobId(), inputExchange);

        rabbitTemplate.convertAndSend(inputExchange, inputRoutingKey, request);
    }
}
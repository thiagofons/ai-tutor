package com.carlosribeiro.gateway.producer;

import com.carlosribeiro.gateway.dto.QueueMessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ItemProducer {

    private static final Logger log = LoggerFactory.getLogger(ItemProducer.class);

    private final RabbitTemplate rabbitTemplate;
    private final String inputQueue;

    public ItemProducer(
            RabbitTemplate rabbitTemplate,
            @Value("${app.rabbitmq.queues.input}") String inputQueue) {
        this.rabbitTemplate = rabbitTemplate;
        this.inputQueue = inputQueue;
    }

    public void send(QueueMessageDTO message) {
        log.info("Publishing jobId={} on queue={}", message.jobId(), inputQueue);

        rabbitTemplate.convertAndSend("", inputQueue, message);
    }
}
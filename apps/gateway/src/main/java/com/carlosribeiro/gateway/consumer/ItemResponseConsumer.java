package com.carlosribeiro.gateway.consumer;

import com.carlosribeiro.gateway.dto.WorkerResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class ItemResponseConsumer {

    private static final Logger log = LoggerFactory.getLogger(ItemResponseConsumer.class);

    private final SimpMessagingTemplate messagingTemplate;

    public ItemResponseConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "${app.rabbitmq.queues.output}")
    public void receive(WorkerResponseDTO response) {
        if (response == null || response.jobId() == null) {
            log.warn("Received message with invalid jobId: {}", response);
            return;
        }

        String to = "/topic/itens/" + response.jobId();
        log.info("Received result from worker with jobId={} (status={}) Sending to {}",
                response.jobId(), response.status(), to);

        messagingTemplate.convertAndSend(to, response);
    }
}
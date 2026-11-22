package com.carlosribeiro.gateway.controller;

import com.carlosribeiro.gateway.dto.ItemRequestDTO;
import com.carlosribeiro.gateway.dto.JobCreatedResponseDTO;
import com.carlosribeiro.gateway.dto.QueueMessageDTO;
import com.carlosribeiro.gateway.producer.ItemProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/itens")
public class ItemController {

    private static final Logger log = LoggerFactory.getLogger(ItemController.class);

    private final ItemProducer itemProducer;

    public ItemController(ItemProducer itemProducer) {
        this.itemProducer = itemProducer;
    }

    @PostMapping
    public ResponseEntity<JobCreatedResponseDTO> queryItem(@RequestBody ItemRequestDTO query) {
        String jobId = UUID.randomUUID().toString();
        String topic = "/topic/itens/" + jobId;

        log.info("New request received. Generated jobId={}", jobId);

        QueueMessageDTO message = new QueueMessageDTO(jobId, query);
        itemProducer.send(message);

        return ResponseEntity
                .accepted()
                .body(new JobCreatedResponseDTO(jobId, topic));
    }
}

package com.carlosribeiro.gateway.controller;

import com.carlosribeiro.gateway.domain.dto.UserQueryRequestDTO;
import com.carlosribeiro.gateway.domain.dto.JobCreatedResponseDTO;
import com.carlosribeiro.gateway.domain.dto.QueueRequestMessageDTO;
import com.carlosribeiro.gateway.producer.ItemProducer;
import com.carlosribeiro.gateway.sse.SseEmitterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

@RestController
@RequestMapping("/api/itens")
public class ItemController {

    private static final Logger log = LoggerFactory.getLogger(ItemController.class);

    private final ItemProducer itemProducer;
    private final SseEmitterRegistry sseRegistry;

    public ItemController(ItemProducer itemProducer, SseEmitterRegistry sseRegistry) {
        this.itemProducer = itemProducer;
        this.sseRegistry = sseRegistry;
    }

    @PostMapping
    public ResponseEntity<JobCreatedResponseDTO> queryItem(@RequestBody UserQueryRequestDTO query) {
        String jobId = UUID.randomUUID().toString();
        String streamUrl = "/api/itens/" + jobId + "/stream";

        log.info("New request received. Generated jobId={} and streamUrl={}", jobId, streamUrl);

        QueueRequestMessageDTO message = new QueueRequestMessageDTO(jobId, query);
        itemProducer.send(message);

        return ResponseEntity
                .accepted()
                .body(new JobCreatedResponseDTO(jobId, streamUrl));
    }

    @GetMapping(value="/{jobId}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter followJob(@PathVariable String jobId) {
        return sseRegistry.register(jobId);
    }
}

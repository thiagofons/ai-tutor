package com.carlosribeiro.worker.port;

import org.springframework.messaging.handler.annotation.Payload;

public interface QueueConsumerPort {
    public void Receive(@Payload String fileBody);
}

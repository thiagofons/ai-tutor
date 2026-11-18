package com.carlosribeiro.worker.adapter;

import com.carlosribeiro.worker.port.QueueConsumerPort;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RabbitMqQueueConsumerAdapter implements QueueConsumerPort {

    @Override
    @RabbitListener(queues = {"${queue.queries.name}"})
    public void Receive(String fileBody) {

    }
}

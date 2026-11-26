package com.carlosribeiro.gateway.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.RabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.json.JsonMapper;

@Configuration
public class RabbitMqConfig {

    @Value("${app.rabbitmq.queues.input}")
    private String inputQueue;

    @Value("${app.rabbitmq.queues.dlq}")
    private String dlqQueue;

    @Value("${app.rabbitmq.queues.output}")
    private String outputQueue;

    @Value("${app.rabbitmq.exchanges.input}")
    private String inputExchange;

    @Value("${app.rabbitmq.exchanges.output}")
    private String outputExchange;

    @Value("${app.rabbitmq.routing-keys.input}")
    private String inputRoutingKey;

    @Value("${app.rabbitmq.routing-keys.output}")
    private String outputRoutingKey;

    @Bean
    public DirectExchange inputExchange() {
        return new DirectExchange(inputExchange);
    }

    @Bean
    public Queue inputQueue() {
        return QueueBuilder.durable(inputQueue)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", dlqQueue)
                .build();
    }

    @Bean
    public Queue dlqQueue() {
        return QueueBuilder.durable(dlqQueue).build();
    }

    @Bean
    public Binding inputBinding(Queue inputQueue, DirectExchange inputExchange) {
        return BindingBuilder.bind(inputQueue)
                .to(inputExchange)
                .with(inputRoutingKey);
    }

    @Bean
    public DirectExchange outputExchange() {
        return new DirectExchange(outputExchange);
    }

    @Bean
    public Queue outputQueue() {
        return QueueBuilder.durable(outputQueue).build();
    }

    @Bean
    public Binding outputBinding(Queue outputQueue, DirectExchange outputExchange) {
        return BindingBuilder.bind(outputQueue)
                .to(outputExchange)
                .with(outputRoutingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter(JsonMapper jsonMapper) {
        JacksonJsonMessageConverter converter = new JacksonJsonMessageConverter(jsonMapper);
        converter.setAlwaysConvertToInferredType(true);
        return converter;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }

    @Bean
    public RabbitListenerContainerFactory<SimpleMessageListenerContainer> rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter jsonMessageConverter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter);
        factory.setDefaultRequeueRejected(false);
        return factory;
    }
}
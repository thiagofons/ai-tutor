package com.carlosribeiro.worker.adapters.outbound.llm;

import com.carlosribeiro.worker.core.domain.LLMResult;
import com.carlosribeiro.worker.core.domain.dto.QueueRequestMessageDTO;
import com.carlosribeiro.worker.core.ports.outbound.LLMClientPort;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

@Component
public class OpenAIAdapter implements LLMClientPort {
    private final ChatClient chatClient;

    public OpenAIAdapter(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("Você é um tutor especialista. Responda de forma didática e concisa.")
                .build();
    }

    @Override
    public LLMResult generate(QueueRequestMessageDTO message) {
        if (message == null || message.payload() == null || message.payload().query() == null) {
            throw new IllegalArgumentException("Mensagem inválida: o campo 'payload.query' está ausente.");
        }

        String answer = chatClient
                .prompt()
                .user(u -> u
                        .text("Pergunta: {question}")
                        .param("question", message.payload().query()))
                .call()
                .content();

        return new LLMResult(answer);
    }
}
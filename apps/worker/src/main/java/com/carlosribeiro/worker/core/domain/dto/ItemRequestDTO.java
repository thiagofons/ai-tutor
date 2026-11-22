package com.carlosribeiro.worker.core.domain.dto;

public record InputQueryDto(
        String id,
        String content
) {
    public InputQueryDto {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Item id is mandatory");
        }
        if (content == null || content.trim().split("\\s++").length < 3) {
            throw new IllegalArgumentException("Content must have at least 3 words for analysis");
        }
    }
}

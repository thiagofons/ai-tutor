package com.carlosribeiro.gateway.domain.util;

public record UserInfo(
        boolean valid,
        boolean duplicated,
        String message
) {}

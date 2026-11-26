package com.carlosribeiro.gateway.domain.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CreateUserDTO {
    @NotEmpty(message = "The 'name' must be informed")
    private String name;

    @NotEmpty(message = "The 'email' must be informed")
    @Email(message = "Email inválido.")
    private String email;

    @NotEmpty(message = "The 'password' must be informed")
    private String password;
}

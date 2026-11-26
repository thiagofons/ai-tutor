package com.carlosribeiro.gateway.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserLoginDTO {
    @NotBlank(message = "'email' must be informed")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "'password' must be informed")
    private String password;
}

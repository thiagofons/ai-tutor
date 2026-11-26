package com.carlosribeiro.gateway.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "The 'name' must be informed")
    private String name;

    @NotEmpty(message = "The 'email' must be informed")
    @Email(message = "Email inválido.")
    @Column(unique = true)
    private String email;

    @NotEmpty(message = "The 'password' must be informed")
    private String password;

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

package com.carlosribeiro.gateway;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableRabbit
@SpringBootApplication
public class GatewayApplication {
	static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}
}

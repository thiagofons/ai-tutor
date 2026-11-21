package com.carlosribeiro.worker;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableRabbit
@SpringBootApplication
public class WorkerApplication {
	static void main(String[] args) {
		SpringApplication.run(WorkerApplication.class, args);
	}
}

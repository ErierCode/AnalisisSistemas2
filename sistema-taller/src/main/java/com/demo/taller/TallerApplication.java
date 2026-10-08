package com.demo.taller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CLASE PRINCIPAL DEL PROYECTO.
 *
 * @SpringBootApplication le indica a Spring Boot que esta es la clase
 * desde la cual debe iniciar y configurar automaticamente la aplicacion.
 */
@SpringBootApplication
public class TallerApplication {

    public static void main(String[] args) {
        // SpringApplication.run inicia Spring y el servidor web integrado.
        // Accedemos a la aplicacion por localhost:8081.
        SpringApplication.run(TallerApplication.class, args);
    }
}

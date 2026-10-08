package com.demo.taller.repository;

import com.demo.taller.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA para la entidad Cliente.
 */
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}

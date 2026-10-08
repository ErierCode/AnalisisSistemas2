package com.demo.taller.repository;

import com.demo.taller.model.Mecanico;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA para la entidad Mecanico.
 */
public interface MecanicoRepository extends JpaRepository<Mecanico, Long> {
}

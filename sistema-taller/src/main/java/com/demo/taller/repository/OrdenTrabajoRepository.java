package com.demo.taller.repository;

import com.demo.taller.model.OrdenTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA para la entidad OrdenTrabajo.
 */
public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long> {

    long countByVehiculo_Id(Long vehiculoId);

    long countByMecanico_Id(Long mecanicoId);
}

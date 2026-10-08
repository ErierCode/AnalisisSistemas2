package com.demo.taller.service;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.EstadoOrden;
import com.demo.taller.model.Mecanico;
import com.demo.taller.model.OrdenTrabajo;
import com.demo.taller.model.Vehiculo;
import com.demo.taller.repository.OrdenTrabajoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * CAPA DE SERVICIO para ordenes de trabajo.
 * Incluye la regla de avance secuencial de estados.
 */
@Service
public class OrdenTrabajoService {

    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final VehiculoService vehiculoService;
    private final MecanicoService mecanicoService;

    public OrdenTrabajoService(OrdenTrabajoRepository ordenTrabajoRepository,
                               VehiculoService vehiculoService,
                               MecanicoService mecanicoService) {
        this.ordenTrabajoRepository = ordenTrabajoRepository;
        this.vehiculoService = vehiculoService;
        this.mecanicoService = mecanicoService;
    }

    public List<OrdenTrabajo> listar() {
        return ordenTrabajoRepository.findAll();
    }

    public OrdenTrabajo obtener(Long id) {
        return ordenTrabajoRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Orden no encontrada con id " + id));
    }

    public OrdenTrabajo crear(OrdenTrabajo orden) {
        if (orden.getVehiculoId() == null || orden.getMecanicoId() == null) {
            throw new NegocioException("Debe indicar vehiculo y mecanico para la orden.");
        }

        Vehiculo vehiculo = vehiculoService.obtener(orden.getVehiculoId());
        Mecanico mecanico = mecanicoService.obtener(orden.getMecanicoId());

        orden.setId(null);
        orden.setVehiculo(vehiculo);
        orden.setMecanico(mecanico);
        orden.setFechaIngreso(LocalDate.now());
        orden.setEstado(EstadoOrden.RECIBIDO);
        return ordenTrabajoRepository.save(orden);
    }

    public OrdenTrabajo actualizar(Long id, OrdenTrabajo datos) {
        OrdenTrabajo existente = obtener(id);

        if (datos.getVehiculoId() == null || datos.getMecanicoId() == null) {
            throw new NegocioException("Debe indicar vehiculo y mecanico para la orden.");
        }

        Vehiculo vehiculo = vehiculoService.obtener(datos.getVehiculoId());
        Mecanico mecanico = mecanicoService.obtener(datos.getMecanicoId());

        existente.setVehiculo(vehiculo);
        existente.setMecanico(mecanico);
        existente.setDescripcion(datos.getDescripcion());
        existente.setCosto(datos.getCosto());
        return ordenTrabajoRepository.save(existente);
    }

    public void eliminar(Long id) {
        obtener(id);
        ordenTrabajoRepository.deleteById(id);
    }

    /**
     * Cambia el estado solo si el nuevo estado es el siguiente en la secuencia.
     */
    public OrdenTrabajo cambiarEstado(Long id, EstadoOrden nuevoEstado) {
        OrdenTrabajo orden = obtener(id);
        EstadoOrden actual = orden.getEstado();

        if (actual == EstadoOrden.ENTREGADO) {
            throw new NegocioException("La orden ya fue entregada y no puede cambiar de estado.");
        }

        EstadoOrden esperado = siguienteEstado(actual);
        if (nuevoEstado != esperado) {
            throw new NegocioException(
                    "Transicion invalida. Desde " + actual + " solo se puede pasar a " + esperado + ".");
        }

        orden.setEstado(nuevoEstado);
        return ordenTrabajoRepository.save(orden);
    }

    public EstadoOrden siguienteEstado(EstadoOrden actual) {
        return switch (actual) {
            case RECIBIDO -> EstadoOrden.EN_PROCESO;
            case EN_PROCESO -> EstadoOrden.LISTO;
            case LISTO -> EstadoOrden.ENTREGADO;
            case ENTREGADO -> null;
        };
    }
}

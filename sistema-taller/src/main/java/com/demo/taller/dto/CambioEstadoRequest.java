package com.demo.taller.dto;

import com.demo.taller.model.EstadoOrden;
import jakarta.validation.constraints.NotNull;

/**
 * Cuerpo JSON para cambiar el estado de una orden.
 */
public class CambioEstadoRequest {

    @NotNull(message = "El estado es obligatorio")
    private EstadoOrden estado;

    public EstadoOrden getEstado() {
        return estado;
    }

    public void setEstado(EstadoOrden estado) {
        this.estado = estado;
    }
}

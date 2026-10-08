package com.demo.taller.controller;

import com.demo.taller.dto.CambioEstadoRequest;
import com.demo.taller.model.OrdenTrabajo;
import com.demo.taller.service.OrdenTrabajoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API REST de ordenes de trabajo.
 */
@RestController
@RequestMapping("/api/ordenes")
public class OrdenTrabajoRestController {

    private final OrdenTrabajoService ordenTrabajoService;

    public OrdenTrabajoRestController(OrdenTrabajoService ordenTrabajoService) {
        this.ordenTrabajoService = ordenTrabajoService;
    }

    @GetMapping
    public List<OrdenTrabajo> listar() {
        return ordenTrabajoService.listar();
    }

    @GetMapping("/{id}")
    public OrdenTrabajo obtener(@PathVariable Long id) {
        return ordenTrabajoService.obtener(id);
    }

    @PostMapping
    public OrdenTrabajo crear(@Valid @RequestBody OrdenTrabajo orden) {
        return ordenTrabajoService.crear(orden);
    }

    @PutMapping("/{id}")
    public OrdenTrabajo actualizar(@PathVariable Long id, @Valid @RequestBody OrdenTrabajo orden) {
        return ordenTrabajoService.actualizar(id, orden);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ordenTrabajoService.eliminar(id);
    }

    @PostMapping("/{id}/estado")
    public OrdenTrabajo cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstadoRequest request) {
        return ordenTrabajoService.cambiarEstado(id, request.getEstado());
    }
}

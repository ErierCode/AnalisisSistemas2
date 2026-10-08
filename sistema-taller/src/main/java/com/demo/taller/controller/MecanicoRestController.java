package com.demo.taller.controller;

import com.demo.taller.model.Mecanico;
import com.demo.taller.service.MecanicoService;
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
 * API REST de mecanicos.
 */
@RestController
@RequestMapping("/api/mecanicos")
public class MecanicoRestController {

    private final MecanicoService mecanicoService;

    public MecanicoRestController(MecanicoService mecanicoService) {
        this.mecanicoService = mecanicoService;
    }

    @GetMapping
    public List<Mecanico> listar() {
        return mecanicoService.listar();
    }

    @GetMapping("/{id}")
    public Mecanico obtener(@PathVariable Long id) {
        return mecanicoService.obtener(id);
    }

    @PostMapping
    public Mecanico crear(@Valid @RequestBody Mecanico mecanico) {
        return mecanicoService.crear(mecanico);
    }

    @PutMapping("/{id}")
    public Mecanico actualizar(@PathVariable Long id, @Valid @RequestBody Mecanico mecanico) {
        return mecanicoService.actualizar(id, mecanico);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        mecanicoService.eliminar(id);
    }
}

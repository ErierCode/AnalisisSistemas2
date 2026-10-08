package com.demo.taller.service;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.Mecanico;
import com.demo.taller.repository.MecanicoRepository;
import com.demo.taller.repository.OrdenTrabajoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CAPA DE SERVICIO para mecanicos.
 */
@Service
public class MecanicoService {

    private final MecanicoRepository mecanicoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    public MecanicoService(MecanicoRepository mecanicoRepository,
                           OrdenTrabajoRepository ordenTrabajoRepository) {
        this.mecanicoRepository = mecanicoRepository;
        this.ordenTrabajoRepository = ordenTrabajoRepository;
    }

    public List<Mecanico> listar() {
        return mecanicoRepository.findAll();
    }

    public Mecanico obtener(Long id) {
        return mecanicoRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Mecanico no encontrado con id " + id));
    }

    public Mecanico crear(Mecanico mecanico) {
        mecanico.setId(null);
        return mecanicoRepository.save(mecanico);
    }

    public Mecanico actualizar(Long id, Mecanico datos) {
        Mecanico existente = obtener(id);
        existente.setNombre(datos.getNombre());
        existente.setEspecialidad(datos.getEspecialidad());
        return mecanicoRepository.save(existente);
    }

    public void eliminar(Long id) {
        obtener(id);
        if (ordenTrabajoRepository.countByMecanico_Id(id) > 0) {
            throw new NegocioException("No se puede eliminar un mecanico que tiene ordenes de trabajo.");
        }
        mecanicoRepository.deleteById(id);
    }
}

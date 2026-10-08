package com.demo.taller.service;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.Cliente;
import com.demo.taller.model.Vehiculo;
import com.demo.taller.repository.OrdenTrabajoRepository;
import com.demo.taller.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CAPA DE SERVICIO para vehiculos.
 */
@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;
    private final ClienteService clienteService;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository,
                           ClienteService clienteService,
                           OrdenTrabajoRepository ordenTrabajoRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.clienteService = clienteService;
        this.ordenTrabajoRepository = ordenTrabajoRepository;
    }

    public List<Vehiculo> listar() {
        return vehiculoRepository.findAll();
    }

    public Vehiculo obtener(Long id) {
        return vehiculoRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Vehiculo no encontrado con id " + id));
    }

    public Vehiculo crear(Vehiculo vehiculo) {
        if (vehiculo.getClienteId() == null) {
            throw new NegocioException("Debe indicar el cliente del vehiculo.");
        }
        if (vehiculoRepository.existsByPlaca(vehiculo.getPlaca())) {
            throw new NegocioException("Ya existe un vehiculo con la placa " + vehiculo.getPlaca());
        }

        Cliente cliente = clienteService.obtener(vehiculo.getClienteId());
        vehiculo.setId(null);
        vehiculo.setCliente(cliente);
        return vehiculoRepository.save(vehiculo);
    }

    public Vehiculo actualizar(Long id, Vehiculo datos) {
        Vehiculo existente = obtener(id);

        if (datos.getClienteId() == null) {
            throw new NegocioException("Debe indicar el cliente del vehiculo.");
        }
        if (vehiculoRepository.existsByPlacaAndIdNot(datos.getPlaca(), id)) {
            throw new NegocioException("Ya existe un vehiculo con la placa " + datos.getPlaca());
        }

        Cliente cliente = clienteService.obtener(datos.getClienteId());
        existente.setPlaca(datos.getPlaca());
        existente.setMarca(datos.getMarca());
        existente.setModelo(datos.getModelo());
        existente.setAnio(datos.getAnio());
        existente.setCliente(cliente);
        return vehiculoRepository.save(existente);
    }

    public void eliminar(Long id) {
        obtener(id);
        if (ordenTrabajoRepository.countByVehiculo_Id(id) > 0) {
            throw new NegocioException("No se puede eliminar un vehiculo que tiene ordenes de trabajo.");
        }
        vehiculoRepository.deleteById(id);
    }
}

package com.demo.taller.service;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.Cliente;
import com.demo.taller.repository.ClienteRepository;
import com.demo.taller.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CAPA DE SERVICIO para clientes.
 * Contiene la logica de negocio y validaciones.
 */
@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final VehiculoRepository vehiculoRepository;

    public ClienteService(ClienteRepository clienteRepository, VehiculoRepository vehiculoRepository) {
        this.clienteRepository = clienteRepository;
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    public Cliente obtener(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Cliente no encontrado con id " + id));
    }

    public Cliente crear(Cliente cliente) {
        cliente.setId(null);
        return clienteRepository.save(cliente);
    }

    public Cliente actualizar(Long id, Cliente datos) {
        Cliente existente = obtener(id);
        existente.setNombre(datos.getNombre());
        existente.setTelefono(datos.getTelefono());
        existente.setCorreo(datos.getCorreo());
        return clienteRepository.save(existente);
    }

    public void eliminar(Long id) {
        obtener(id);
        if (vehiculoRepository.countByCliente_Id(id) > 0) {
            throw new NegocioException("No se puede eliminar un cliente que tiene vehiculos registrados.");
        }
        clienteRepository.deleteById(id);
    }
}

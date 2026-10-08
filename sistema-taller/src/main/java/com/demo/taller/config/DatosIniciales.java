package com.demo.taller.config;

import com.demo.taller.model.Cliente;
import com.demo.taller.model.EstadoOrden;
import com.demo.taller.model.Mecanico;
import com.demo.taller.model.OrdenTrabajo;
import com.demo.taller.model.Vehiculo;
import com.demo.taller.repository.ClienteRepository;
import com.demo.taller.repository.MecanicoRepository;
import com.demo.taller.repository.OrdenTrabajoRepository;
import com.demo.taller.repository.VehiculoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Carga datos de ejemplo al iniciar la aplicacion
 * para que las pantallas no salgan vacias.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final ClienteRepository clienteRepository;
    private final VehiculoRepository vehiculoRepository;
    private final MecanicoRepository mecanicoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    public DatosIniciales(ClienteRepository clienteRepository,
                          VehiculoRepository vehiculoRepository,
                          MecanicoRepository mecanicoRepository,
                          OrdenTrabajoRepository ordenTrabajoRepository) {
        this.clienteRepository = clienteRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.mecanicoRepository = mecanicoRepository;
        this.ordenTrabajoRepository = ordenTrabajoRepository;
    }

    @Override
    public void run(String... args) {
        if (clienteRepository.count() > 0) {
            return;
        }

        Cliente cliente1 = clienteRepository.save(new Cliente("Ana Lopez", "5555-1111", "ana@example.com"));
        Cliente cliente2 = clienteRepository.save(new Cliente("Luis Perez", "5555-2222", "luis@example.com"));

        Vehiculo vehiculo1 = new Vehiculo();
        vehiculo1.setPlaca("P123ABC");
        vehiculo1.setMarca("Toyota");
        vehiculo1.setModelo("Corolla");
        vehiculo1.setAnio(2018);
        vehiculo1.setCliente(cliente1);
        vehiculo1 = vehiculoRepository.save(vehiculo1);

        Vehiculo vehiculo2 = new Vehiculo();
        vehiculo2.setPlaca("P456DEF");
        vehiculo2.setMarca("Honda");
        vehiculo2.setModelo("Civic");
        vehiculo2.setAnio(2020);
        vehiculo2.setCliente(cliente2);
        vehiculo2 = vehiculoRepository.save(vehiculo2);

        Mecanico mecanico1 = mecanicoRepository.save(new Mecanico("Carlos Ruiz", "Motor"));
        Mecanico mecanico2 = mecanicoRepository.save(new Mecanico("Maria Gomez", "Frenos"));

        OrdenTrabajo orden1 = new OrdenTrabajo();
        orden1.setVehiculo(vehiculo1);
        orden1.setMecanico(mecanico1);
        orden1.setDescripcion("Cambio de aceite y filtros");
        orden1.setCosto(new BigDecimal("350.00"));
        orden1.setFechaIngreso(LocalDate.now().minusDays(2));
        orden1.setEstado(EstadoOrden.RECIBIDO);
        ordenTrabajoRepository.save(orden1);

        OrdenTrabajo orden2 = new OrdenTrabajo();
        orden2.setVehiculo(vehiculo2);
        orden2.setMecanico(mecanico2);
        orden2.setDescripcion("Revision de frenos delanteros");
        orden2.setCosto(new BigDecimal("480.00"));
        orden2.setFechaIngreso(LocalDate.now().minusDays(1));
        orden2.setEstado(EstadoOrden.EN_PROCESO);
        ordenTrabajoRepository.save(orden2);
    }
}

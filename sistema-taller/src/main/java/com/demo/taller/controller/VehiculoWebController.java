package com.demo.taller.controller;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.Vehiculo;
import com.demo.taller.service.ClienteService;
import com.demo.taller.service.VehiculoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controlador web (HTML) para vehiculos.
 */
@Controller
@RequestMapping("/vehiculos")
public class VehiculoWebController {

    private final VehiculoService vehiculoService;
    private final ClienteService clienteService;

    public VehiculoWebController(VehiculoService vehiculoService, ClienteService clienteService) {
        this.vehiculoService = vehiculoService;
        this.clienteService = clienteService;
    }

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("vehiculos", vehiculoService.listar());
        return "vehiculos/lista";
    }

    @GetMapping("/nuevo")
    public String formularioNuevo(Model model) {
        model.addAttribute("vehiculo", new Vehiculo());
        model.addAttribute("clientes", clienteService.listar());
        model.addAttribute("titulo", "Nuevo vehiculo");
        return "vehiculos/formulario";
    }

    @GetMapping("/editar/{id}")
    public String formularioEditar(@PathVariable Long id, Model model, RedirectAttributes redirect) {
        try {
            model.addAttribute("vehiculo", vehiculoService.obtener(id));
            model.addAttribute("clientes", clienteService.listar());
            model.addAttribute("titulo", "Editar vehiculo");
            return "vehiculos/formulario";
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
            return "redirect:/vehiculos";
        }
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Vehiculo vehiculo, RedirectAttributes redirect) {
        try {
            if (vehiculo.getId() == null) {
                vehiculoService.crear(vehiculo);
                redirect.addFlashAttribute("mensaje", "Vehiculo creado correctamente.");
            } else {
                vehiculoService.actualizar(vehiculo.getId(), vehiculo);
                redirect.addFlashAttribute("mensaje", "Vehiculo actualizado correctamente.");
            }
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/vehiculos";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id, RedirectAttributes redirect) {
        try {
            vehiculoService.eliminar(id);
            redirect.addFlashAttribute("mensaje", "Vehiculo eliminado correctamente.");
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/vehiculos";
    }
}

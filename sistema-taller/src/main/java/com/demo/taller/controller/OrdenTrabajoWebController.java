package com.demo.taller.controller;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.EstadoOrden;
import com.demo.taller.model.OrdenTrabajo;
import com.demo.taller.service.MecanicoService;
import com.demo.taller.service.OrdenTrabajoService;
import com.demo.taller.service.VehiculoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controlador web (HTML) para ordenes de trabajo.
 */
@Controller
@RequestMapping("/ordenes")
public class OrdenTrabajoWebController {

    private final OrdenTrabajoService ordenTrabajoService;
    private final VehiculoService vehiculoService;
    private final MecanicoService mecanicoService;

    public OrdenTrabajoWebController(OrdenTrabajoService ordenTrabajoService,
                                     VehiculoService vehiculoService,
                                     MecanicoService mecanicoService) {
        this.ordenTrabajoService = ordenTrabajoService;
        this.vehiculoService = vehiculoService;
        this.mecanicoService = mecanicoService;
    }

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("ordenes", ordenTrabajoService.listar());
        model.addAttribute("servicio", ordenTrabajoService);
        return "ordenes/lista";
    }

    @GetMapping("/nuevo")
    public String formularioNuevo(Model model) {
        model.addAttribute("orden", new OrdenTrabajo());
        model.addAttribute("vehiculos", vehiculoService.listar());
        model.addAttribute("mecanicos", mecanicoService.listar());
        model.addAttribute("titulo", "Nueva orden");
        return "ordenes/formulario";
    }

    @GetMapping("/editar/{id}")
    public String formularioEditar(@PathVariable Long id, Model model, RedirectAttributes redirect) {
        try {
            model.addAttribute("orden", ordenTrabajoService.obtener(id));
            model.addAttribute("vehiculos", vehiculoService.listar());
            model.addAttribute("mecanicos", mecanicoService.listar());
            model.addAttribute("titulo", "Editar orden");
            return "ordenes/formulario";
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
            return "redirect:/ordenes";
        }
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute OrdenTrabajo orden, RedirectAttributes redirect) {
        try {
            if (orden.getId() == null) {
                ordenTrabajoService.crear(orden);
                redirect.addFlashAttribute("mensaje", "Orden creada correctamente.");
            } else {
                ordenTrabajoService.actualizar(orden.getId(), orden);
                redirect.addFlashAttribute("mensaje", "Orden actualizada correctamente.");
            }
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ordenes";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id, RedirectAttributes redirect) {
        try {
            ordenTrabajoService.eliminar(id);
            redirect.addFlashAttribute("mensaje", "Orden eliminada correctamente.");
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ordenes";
    }

    @PostMapping("/{id}/avanzar")
    public String avanzar(@PathVariable Long id, @RequestParam EstadoOrden estado, RedirectAttributes redirect) {
        try {
            ordenTrabajoService.cambiarEstado(id, estado);
            redirect.addFlashAttribute("mensaje", "Estado actualizado a " + estado + ".");
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ordenes";
    }
}

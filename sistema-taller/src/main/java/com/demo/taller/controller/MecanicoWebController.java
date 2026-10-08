package com.demo.taller.controller;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.Mecanico;
import com.demo.taller.service.MecanicoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controlador web (HTML) para mecanicos.
 */
@Controller
@RequestMapping("/mecanicos")
public class MecanicoWebController {

    private final MecanicoService mecanicoService;

    public MecanicoWebController(MecanicoService mecanicoService) {
        this.mecanicoService = mecanicoService;
    }

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("mecanicos", mecanicoService.listar());
        return "mecanicos/lista";
    }

    @GetMapping("/nuevo")
    public String formularioNuevo(Model model) {
        model.addAttribute("mecanico", new Mecanico());
        model.addAttribute("titulo", "Nuevo mecanico");
        return "mecanicos/formulario";
    }

    @GetMapping("/editar/{id}")
    public String formularioEditar(@PathVariable Long id, Model model, RedirectAttributes redirect) {
        try {
            model.addAttribute("mecanico", mecanicoService.obtener(id));
            model.addAttribute("titulo", "Editar mecanico");
            return "mecanicos/formulario";
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
            return "redirect:/mecanicos";
        }
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Mecanico mecanico, RedirectAttributes redirect) {
        try {
            if (mecanico.getId() == null) {
                mecanicoService.crear(mecanico);
                redirect.addFlashAttribute("mensaje", "Mecanico creado correctamente.");
            } else {
                mecanicoService.actualizar(mecanico.getId(), mecanico);
                redirect.addFlashAttribute("mensaje", "Mecanico actualizado correctamente.");
            }
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/mecanicos";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id, RedirectAttributes redirect) {
        try {
            mecanicoService.eliminar(id);
            redirect.addFlashAttribute("mensaje", "Mecanico eliminado correctamente.");
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/mecanicos";
    }
}

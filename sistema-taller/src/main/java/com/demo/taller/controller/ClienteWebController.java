package com.demo.taller.controller;

import com.demo.taller.exception.NegocioException;
import com.demo.taller.model.Cliente;
import com.demo.taller.service.ClienteService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controlador web (HTML) para clientes.
 */
@Controller
@RequestMapping("/clientes")
public class ClienteWebController {

    private final ClienteService clienteService;

    public ClienteWebController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("clientes", clienteService.listar());
        return "clientes/lista";
    }

    @GetMapping("/nuevo")
    public String formularioNuevo(Model model) {
        model.addAttribute("cliente", new Cliente());
        model.addAttribute("titulo", "Nuevo cliente");
        return "clientes/formulario";
    }

    @GetMapping("/editar/{id}")
    public String formularioEditar(@PathVariable Long id, Model model, RedirectAttributes redirect) {
        try {
            model.addAttribute("cliente", clienteService.obtener(id));
            model.addAttribute("titulo", "Editar cliente");
            return "clientes/formulario";
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
            return "redirect:/clientes";
        }
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Cliente cliente, RedirectAttributes redirect) {
        try {
            if (cliente.getId() == null) {
                clienteService.crear(cliente);
                redirect.addFlashAttribute("mensaje", "Cliente creado correctamente.");
            } else {
                clienteService.actualizar(cliente.getId(), cliente);
                redirect.addFlashAttribute("mensaje", "Cliente actualizado correctamente.");
            }
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/clientes";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id, RedirectAttributes redirect) {
        try {
            clienteService.eliminar(id);
            redirect.addFlashAttribute("mensaje", "Cliente eliminado correctamente.");
        } catch (NegocioException ex) {
            redirect.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/clientes";
    }
}

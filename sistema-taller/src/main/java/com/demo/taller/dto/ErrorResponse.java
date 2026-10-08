package com.demo.taller.dto;

/**
 * Respuesta JSON estandar para errores de negocio o validacion.
 */
public class ErrorResponse {

    private String mensaje;

    public ErrorResponse(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}

package com.demo.taller.exception;

/**
 * Excepcion de reglas de negocio del taller.
 * Se convierte en respuesta HTTP 400 en los controladores.
 */
public class NegocioException extends RuntimeException {

    public NegocioException(String mensaje) {
        super(mensaje);
    }
}

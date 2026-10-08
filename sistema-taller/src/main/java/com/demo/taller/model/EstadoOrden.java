package com.demo.taller.model;

/**
 * Estados posibles de una orden de trabajo.
 * El avance debe respetar este orden: RECIBIDO -> EN_PROCESO -> LISTO -> ENTREGADO.
 */
public enum EstadoOrden {
    RECIBIDO,
    EN_PROCESO,
    LISTO,
    ENTREGADO
}

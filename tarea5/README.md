# Sistema de Farmacia - Vue.js

Proyecto educativo para gestionar una farmacia con Vue 3 y Vue Router.
Sigue la misma idea del sistema de taller: listas, formularios y reglas de negocio,
adaptadas a clientes, medicamentos, farmaceuticos y dispensaciones.

## Requisitos
- Node.js 18 o superior

## Ejecutar
Dentro de la carpeta `tarea5`:

```bash
npm install
npm run dev
```

Abrir `http://localhost:5175`.

## Pantallas
- Inicio: resumen y accesos
- Clientes
- Medicamentos
- Farmaceuticos
- Dispensaciones

## Modelo
- Cliente: nombre, telefono, correo
- Medicamento: codigo, nombre, principio activo, presentacion, stock, precio, requiere receta
- Farmaceutico: nombre, colegiado, turno
- Dispensacion: cliente, medicamento, farmaceutico, cantidad, receta, indicaciones, total, fecha, estado

Estados de dispensacion: `SOLICITADA` -> `PREPARADA` -> `ENTREGADA`

## Reglas
- Codigo de medicamento unico.
- Numero de colegiado unico.
- No se elimina un cliente, medicamento o farmaceutico que tenga dispensaciones.
- Al crear una dispensacion se descuenta el stock. Al eliminarla, se devuelve.
- Si el medicamento requiere receta, el numero de receta es obligatorio.
- El estado solo avanza al siguiente paso.

## Datos
Al abrir la aplicacion por primera vez se cargan datos de ejemplo.
Los cambios quedan en `localStorage` del navegador.
En Inicio esta el boton para restaurar los datos de ejemplo.

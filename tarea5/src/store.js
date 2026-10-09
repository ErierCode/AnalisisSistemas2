import { reactive, watch } from 'vue'

/**
 * Capa de datos y reglas de negocio del sistema de farmacia.
 * Equivale, en el taller mecanico, a Service + Repository,
 * pero vive en el navegador (localStorage) porque esta version es Vue.js.
 */

const CLAVE = 'farmacia-vue-v1'
const ESTADOS = ['SOLICITADA', 'PREPARADA', 'ENTREGADA']

export class NegocioError extends Error {
  constructor(mensaje) {
    super(mensaje)
    this.name = 'NegocioError'
  }
}

function hoy() {
  const fecha = new Date()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

function haceDias(dias) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

function redondear(valor) {
  return Math.round(valor * 100) / 100
}

function datosIniciales() {
  return {
    nextId: {
      clientes: 4,
      medicamentos: 6,
      farmaceuticos: 3,
      dispensaciones: 3,
    },
    clientes: [
      { id: 1, nombre: 'Ana Lopez', telefono: '5555-1111', correo: 'ana@example.com' },
      { id: 2, nombre: 'Luis Perez', telefono: '5555-2222', correo: 'luis@example.com' },
      { id: 3, nombre: 'Marta Diaz', telefono: '5555-3333', correo: 'marta@example.com' },
    ],
    medicamentos: [
      {
        id: 1,
        codigo: 'MED-001',
        nombre: 'Paracetamol 500 mg',
        principioActivo: 'Paracetamol',
        presentacion: 'Tabletas',
        stock: 38,
        precio: 12.5,
        requiereReceta: false,
      },
      {
        id: 2,
        codigo: 'MED-002',
        nombre: 'Amoxicilina 500 mg',
        principioActivo: 'Amoxicilina',
        presentacion: 'Capsulas',
        stock: 19,
        precio: 45,
        requiereReceta: true,
      },
      {
        id: 3,
        codigo: 'MED-003',
        nombre: 'Ibuprofeno 400 mg',
        principioActivo: 'Ibuprofeno',
        presentacion: 'Tabletas',
        stock: 30,
        precio: 18,
        requiereReceta: false,
      },
      {
        id: 4,
        codigo: 'MED-004',
        nombre: 'Loratadina 10 mg',
        principioActivo: 'Loratadina',
        presentacion: 'Tabletas',
        stock: 6,
        precio: 22,
        requiereReceta: false,
      },
      {
        id: 5,
        codigo: 'MED-005',
        nombre: 'Omeprazol 20 mg',
        principioActivo: 'Omeprazol',
        presentacion: 'Capsulas',
        stock: 0,
        precio: 28,
        requiereReceta: true,
      },
    ],
    farmaceuticos: [
      { id: 1, nombre: 'Carlos Ruiz', colegiado: 'COL-1042', turno: 'Matutino' },
      { id: 2, nombre: 'Maria Gomez', colegiado: 'COL-2218', turno: 'Vespertino' },
    ],
    dispensaciones: [
      {
        id: 1,
        clienteId: 1,
        medicamentoId: 1,
        farmaceuticoId: 1,
        cantidad: 2,
        numeroReceta: '',
        indicaciones: 'Tomar una tableta cada 8 horas por dolor de cabeza.',
        total: 25,
        fecha: haceDias(2),
        estado: 'SOLICITADA',
      },
      {
        id: 2,
        clienteId: 2,
        medicamentoId: 2,
        farmaceuticoId: 2,
        cantidad: 1,
        numeroReceta: 'RX-9001',
        indicaciones: 'Una capsula cada 8 horas por 7 dias.',
        total: 45,
        fecha: haceDias(1),
        estado: 'PREPARADA',
      },
    ],
  }
}

function cargar() {
  try {
    const raw = localStorage.getItem(CLAVE)
    if (!raw) return datosIniciales()
    const datos = JSON.parse(raw)
    if (!datos?.clientes || !datos?.medicamentos || !datos?.farmaceuticos || !datos?.dispensaciones) {
      return datosIniciales()
    }
    return datos
  } catch {
    return datosIniciales()
  }
}

export const estado = reactive(cargar())

export const aviso = reactive({
  mensaje: '',
  error: '',
})

watch(
  estado,
  () => {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  },
  { deep: true },
)

export function ok(mensaje) {
  aviso.mensaje = mensaje
  aviso.error = ''
}

export function fail(mensaje) {
  aviso.error = mensaje
  aviso.mensaje = ''
}

export function limpiarAviso() {
  aviso.mensaje = ''
  aviso.error = ''
}

export function restaurarDatos() {
  const fresco = datosIniciales()
  estado.nextId = fresco.nextId
  estado.clientes = fresco.clientes
  estado.medicamentos = fresco.medicamentos
  estado.farmaceuticos = fresco.farmaceuticos
  estado.dispensaciones = fresco.dispensaciones
  localStorage.setItem(CLAVE, JSON.stringify(estado))
}

export function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(Number(valor) || 0)
}

export function formatearFecha(iso) {
  if (!iso) return '-'
  const [anio, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${anio}`
}

export function siguienteEstado(actual) {
  const indice = ESTADOS.indexOf(actual)
  if (indice < 0 || indice === ESTADOS.length - 1) return null
  return ESTADOS[indice + 1]
}

function exigirTexto(valor, mensaje) {
  const texto = String(valor ?? '').trim()
  if (!texto) throw new NegocioError(mensaje)
  return texto
}

function buscar(lista, id, mensaje) {
  const item = lista.find((elemento) => elemento.id === Number(id))
  if (!item) throw new NegocioError(mensaje)
  return item
}

export function obtenerCliente(id) {
  return buscar(estado.clientes, id, `Cliente no encontrado con id ${id}`)
}

export function obtenerMedicamento(id) {
  return buscar(estado.medicamentos, id, `Medicamento no encontrado con id ${id}`)
}

export function obtenerFarmaceutico(id) {
  return buscar(estado.farmaceuticos, id, `Farmaceutico no encontrado con id ${id}`)
}

export function obtenerDispensacion(id) {
  return buscar(estado.dispensaciones, id, `Dispensacion no encontrada con id ${id}`)
}

export function nombreCliente(id) {
  return estado.clientes.find((cliente) => cliente.id === id)?.nombre ?? '-'
}

export function nombreFarmaceutico(id) {
  return estado.farmaceuticos.find((persona) => persona.id === id)?.nombre ?? '-'
}

export function etiquetaMedicamento(id) {
  const medicamento = estado.medicamentos.find((item) => item.id === id)
  if (!medicamento) return '-'
  return `${medicamento.codigo} - ${medicamento.nombre}`
}

export function guardarCliente(datos) {
  const nombre = exigirTexto(datos.nombre, 'El nombre es obligatorio.')
  const telefono = String(datos.telefono ?? '').trim()
  const correo = String(datos.correo ?? '').trim()
  if (correo && !correo.includes('@')) {
    throw new NegocioError('El correo no tiene un formato valido.')
  }

  if (datos.id) {
    const existente = obtenerCliente(datos.id)
    existente.nombre = nombre
    existente.telefono = telefono
    existente.correo = correo
    return existente
  }

  const nuevo = {
    id: estado.nextId.clientes++,
    nombre,
    telefono,
    correo,
  }
  estado.clientes.push(nuevo)
  return nuevo
}

export function eliminarCliente(id) {
  obtenerCliente(id)
  if (estado.dispensaciones.some((item) => item.clienteId === Number(id))) {
    throw new NegocioError('No se puede eliminar un cliente que tiene dispensaciones.')
  }
  estado.clientes = estado.clientes.filter((cliente) => cliente.id !== Number(id))
}

export function guardarMedicamento(datos) {
  const codigo = exigirTexto(datos.codigo, 'El codigo es obligatorio.').toUpperCase()
  const nombre = exigirTexto(datos.nombre, 'El nombre es obligatorio.')
  const principioActivo = exigirTexto(datos.principioActivo, 'El principio activo es obligatorio.')
  const presentacion = exigirTexto(datos.presentacion, 'La presentacion es obligatoria.')
  const stock = Number(datos.stock)
  const precio = Number(datos.precio)

  if (!Number.isInteger(stock) || stock < 0) {
    throw new NegocioError('El stock debe ser un entero mayor o igual a 0.')
  }
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new NegocioError('El precio debe ser mayor a 0.')
  }

  const id = datos.id ? Number(datos.id) : null
  const duplicado = estado.medicamentos.some((item) => item.codigo === codigo && item.id !== id)
  if (duplicado) {
    throw new NegocioError(`Ya existe un medicamento con el codigo ${codigo}.`)
  }

  const registro = {
    codigo,
    nombre,
    principioActivo,
    presentacion,
    stock,
    precio: redondear(precio),
    requiereReceta: Boolean(datos.requiereReceta),
  }

  if (id) {
    const existente = obtenerMedicamento(id)
    Object.assign(existente, registro)
    return existente
  }

  const nuevo = { id: estado.nextId.medicamentos++, ...registro }
  estado.medicamentos.push(nuevo)
  return nuevo
}

export function eliminarMedicamento(id) {
  obtenerMedicamento(id)
  if (estado.dispensaciones.some((item) => item.medicamentoId === Number(id))) {
    throw new NegocioError('No se puede eliminar un medicamento que tiene dispensaciones.')
  }
  estado.medicamentos = estado.medicamentos.filter((item) => item.id !== Number(id))
}

export function guardarFarmaceutico(datos) {
  const nombre = exigirTexto(datos.nombre, 'El nombre es obligatorio.')
  const colegiado = exigirTexto(datos.colegiado, 'El numero de colegiado es obligatorio.').toUpperCase()
  const turno = exigirTexto(datos.turno, 'El turno es obligatorio.')
  const id = datos.id ? Number(datos.id) : null
  const duplicado = estado.farmaceuticos.some((item) => item.colegiado === colegiado && item.id !== id)
  if (duplicado) {
    throw new NegocioError(`Ya existe un farmaceutico con el colegiado ${colegiado}.`)
  }

  if (id) {
    const existente = obtenerFarmaceutico(id)
    existente.nombre = nombre
    existente.colegiado = colegiado
    existente.turno = turno
    return existente
  }

  const nuevo = {
    id: estado.nextId.farmaceuticos++,
    nombre,
    colegiado,
    turno,
  }
  estado.farmaceuticos.push(nuevo)
  return nuevo
}

export function eliminarFarmaceutico(id) {
  obtenerFarmaceutico(id)
  if (estado.dispensaciones.some((item) => item.farmaceuticoId === Number(id))) {
    throw new NegocioError('No se puede eliminar un farmaceutico que tiene dispensaciones.')
  }
  estado.farmaceuticos = estado.farmaceuticos.filter((item) => item.id !== Number(id))
}

function ajustarStock(medIdAnterior, cantAnterior, medIdNuevo, cantNueva) {
  if (medIdAnterior === medIdNuevo) {
    const medicamento = obtenerMedicamento(medIdNuevo)
    const delta = cantNueva - cantAnterior
    if (medicamento.stock < delta) {
      throw new NegocioError(`Stock insuficiente. Disponible: ${medicamento.stock}.`)
    }
    medicamento.stock -= delta
    return
  }

  const anterior = obtenerMedicamento(medIdAnterior)
  const nuevo = obtenerMedicamento(medIdNuevo)
  if (nuevo.stock < cantNueva) {
    throw new NegocioError(`Stock insuficiente. Disponible: ${nuevo.stock}.`)
  }
  anterior.stock += cantAnterior
  nuevo.stock -= cantNueva
}

export function guardarDispensacion(datos) {
  if (!datos.clienteId || !datos.medicamentoId || !datos.farmaceuticoId) {
    throw new NegocioError('Debe indicar cliente, medicamento y farmaceutico.')
  }

  const cliente = obtenerCliente(datos.clienteId)
  const medicamento = obtenerMedicamento(datos.medicamentoId)
  const farmaceutico = obtenerFarmaceutico(datos.farmaceuticoId)
  const cantidad = Number(datos.cantidad)
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new NegocioError('La cantidad debe ser un entero mayor o igual a 1.')
  }

  const numeroReceta = String(datos.numeroReceta ?? '').trim()
  if (medicamento.requiereReceta && !numeroReceta) {
    throw new NegocioError('Este medicamento requiere numero de receta.')
  }

  const indicaciones = exigirTexto(datos.indicaciones, 'Las indicaciones son obligatorias.')

  if (datos.id) {
    const existente = obtenerDispensacion(datos.id)
    ajustarStock(existente.medicamentoId, existente.cantidad, medicamento.id, cantidad)
    existente.clienteId = cliente.id
    existente.medicamentoId = medicamento.id
    existente.farmaceuticoId = farmaceutico.id
    existente.cantidad = cantidad
    existente.numeroReceta = numeroReceta
    existente.indicaciones = indicaciones
    existente.total = redondear(medicamento.precio * cantidad)
    return existente
  }

  if (medicamento.stock < cantidad) {
    throw new NegocioError(`Stock insuficiente. Disponible: ${medicamento.stock}.`)
  }

  medicamento.stock -= cantidad
  const nueva = {
    id: estado.nextId.dispensaciones++,
    clienteId: cliente.id,
    medicamentoId: medicamento.id,
    farmaceuticoId: farmaceutico.id,
    cantidad,
    numeroReceta,
    indicaciones,
    total: redondear(medicamento.precio * cantidad),
    fecha: hoy(),
    estado: 'SOLICITADA',
  }
  estado.dispensaciones.push(nueva)
  return nueva
}

export function eliminarDispensacion(id) {
  const dispensacion = obtenerDispensacion(id)
  const medicamento = obtenerMedicamento(dispensacion.medicamentoId)
  medicamento.stock += dispensacion.cantidad
  estado.dispensaciones = estado.dispensaciones.filter((item) => item.id !== Number(id))
}

export function cambiarEstado(id, nuevoEstado) {
  const dispensacion = obtenerDispensacion(id)
  const esperado = siguienteEstado(dispensacion.estado)
  if (!esperado) {
    throw new NegocioError('La dispensacion ya fue entregada y no puede cambiar de estado.')
  }
  if (nuevoEstado !== esperado) {
    throw new NegocioError(
      `Transicion invalida. Desde ${dispensacion.estado} solo se puede pasar a ${esperado}.`,
    )
  }
  dispensacion.estado = nuevoEstado
  return dispensacion
}

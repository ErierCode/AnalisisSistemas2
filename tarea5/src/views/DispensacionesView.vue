<script setup>
import { useRouter } from 'vue-router'
import {
  estado,
  eliminarDispensacion,
  cambiarEstado,
  siguienteEstado,
  nombreCliente,
  nombreFarmaceutico,
  etiquetaMedicamento,
  formatearMoneda,
  formatearFecha,
  ok,
  fail,
} from '../store'

const router = useRouter()

function eliminar(id) {
  if (!window.confirm('Eliminar esta dispensacion? El stock del medicamento se devolvera.')) return
  try {
    eliminarDispensacion(id)
    ok('Dispensacion eliminada. El stock fue devuelto.')
  } catch (error) {
    fail(error.message)
  }
}

function avanzar(item) {
  const siguiente = siguienteEstado(item.estado)
  try {
    cambiarEstado(item.id, siguiente)
    ok(`Dispensacion ${item.id} paso a ${siguiente}.`)
  } catch (error) {
    fail(error.message)
  }
}

function claseEstado(valor) {
  return `badge badge-${valor.toLowerCase()}`
}
</script>

<template>
  <div class="toolbar">
    <h1>Dispensaciones</h1>
    <router-link class="btn" to="/dispensaciones/nuevo">Nueva dispensacion</router-link>
  </div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Medicamento</th>
          <th>Farmaceutico</th>
          <th>Cant.</th>
          <th>Total</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="estado.dispensaciones.length === 0">
          <td colspan="9" class="vacio">No hay dispensaciones.</td>
        </tr>
        <tr v-for="item in estado.dispensaciones" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ nombreCliente(item.clienteId) }}</td>
          <td>
            {{ etiquetaMedicamento(item.medicamentoId) }}
            <div class="muted" v-if="item.numeroReceta">Receta {{ item.numeroReceta }}</div>
          </td>
          <td>{{ nombreFarmaceutico(item.farmaceuticoId) }}</td>
          <td>{{ item.cantidad }}</td>
          <td>{{ formatearMoneda(item.total) }}</td>
          <td>{{ formatearFecha(item.fecha) }}</td>
          <td><span :class="claseEstado(item.estado)">{{ item.estado }}</span></td>
          <td class="actions">
            <button class="btn btn-secondary btn-small" type="button" @click="router.push(`/dispensaciones/${item.id}/editar`)">
              Editar
            </button>
            <button
              v-if="siguienteEstado(item.estado)"
              class="btn btn-small"
              type="button"
              @click="avanzar(item)"
            >
              Avanzar a {{ siguienteEstado(item.estado) }}
            </button>
            <button class="btn btn-danger btn-small" type="button" @click="eliminar(item.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

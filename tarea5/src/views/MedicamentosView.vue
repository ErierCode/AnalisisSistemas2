<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { estado, eliminarMedicamento, formatearMoneda, ok, fail } from '../store'

const router = useRouter()
const filtro = ref('')

const medicamentos = computed(() => {
  const texto = filtro.value.trim().toLowerCase()
  if (!texto) return estado.medicamentos
  return estado.medicamentos.filter((item) =>
    [item.codigo, item.nombre, item.principioActivo, item.presentacion].join(' ').toLowerCase().includes(texto),
  )
})

function claseStock(stock) {
  if (stock === 0) return 'badge badge-agotado'
  if (stock <= 8) return 'badge badge-bajo'
  return 'badge'
}

function textoStock(stock) {
  if (stock === 0) return 'Agotado'
  if (stock <= 8) return `${stock} bajo`
  return String(stock)
}

function eliminar(id) {
  if (!window.confirm('Eliminar este medicamento?')) return
  try {
    eliminarMedicamento(id)
    ok('Medicamento eliminado.')
  } catch (error) {
    fail(error.message)
  }
}
</script>

<template>
  <div class="toolbar">
    <h1>Medicamentos</h1>
    <router-link class="btn" to="/medicamentos/nuevo">Nuevo medicamento</router-link>
  </div>
  <input v-model="filtro" class="filtro" type="search" placeholder="Buscar medicamento" style="margin-bottom: 1rem;" />
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Codigo</th>
          <th>Nombre</th>
          <th>Principio activo</th>
          <th>Presentacion</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Receta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="medicamentos.length === 0">
          <td colspan="8" class="vacio">No hay medicamentos.</td>
        </tr>
        <tr v-for="item in medicamentos" :key="item.id">
          <td>{{ item.codigo }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.principioActivo }}</td>
          <td>{{ item.presentacion }}</td>
          <td><span :class="claseStock(item.stock)">{{ textoStock(item.stock) }}</span></td>
          <td>{{ formatearMoneda(item.precio) }}</td>
          <td>{{ item.requiereReceta ? 'Si' : 'No' }}</td>
          <td class="actions">
            <button class="btn btn-secondary btn-small" type="button" @click="router.push(`/medicamentos/${item.id}/editar`)">
              Editar
            </button>
            <button class="btn btn-danger btn-small" type="button" @click="eliminar(item.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

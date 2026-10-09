<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { estado, eliminarCliente, ok, fail } from '../store'

const router = useRouter()
const filtro = ref('')

const clientes = computed(() => {
  const texto = filtro.value.trim().toLowerCase()
  if (!texto) return estado.clientes
  return estado.clientes.filter((cliente) =>
    [cliente.nombre, cliente.telefono, cliente.correo].join(' ').toLowerCase().includes(texto),
  )
})

function eliminar(id) {
  if (!window.confirm('Eliminar este cliente?')) return
  try {
    eliminarCliente(id)
    ok('Cliente eliminado.')
  } catch (error) {
    fail(error.message)
  }
}

function editar(id) {
  router.push(`/clientes/${id}/editar`)
}
</script>

<template>
  <div class="toolbar">
    <h1>Clientes</h1>
    <router-link class="btn" to="/clientes/nuevo">Nuevo cliente</router-link>
  </div>
  <input v-model="filtro" class="filtro" type="search" placeholder="Buscar cliente" style="margin-bottom: 1rem;" />
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Telefono</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="clientes.length === 0">
          <td colspan="5" class="vacio">No hay clientes.</td>
        </tr>
        <tr v-for="cliente in clientes" :key="cliente.id">
          <td>{{ cliente.id }}</td>
          <td>{{ cliente.nombre }}</td>
          <td>{{ cliente.telefono || '-' }}</td>
          <td>{{ cliente.correo || '-' }}</td>
          <td class="actions">
            <button class="btn btn-secondary btn-small" type="button" @click="editar(cliente.id)">Editar</button>
            <button class="btn btn-danger btn-small" type="button" @click="eliminar(cliente.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

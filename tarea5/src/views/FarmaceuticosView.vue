<script setup>
import { useRouter } from 'vue-router'
import { estado, eliminarFarmaceutico, ok, fail } from '../store'

const router = useRouter()

function eliminar(id) {
  if (!window.confirm('Eliminar este farmaceutico?')) return
  try {
    eliminarFarmaceutico(id)
    ok('Farmaceutico eliminado.')
  } catch (error) {
    fail(error.message)
  }
}
</script>

<template>
  <div class="toolbar">
    <h1>Farmaceuticos</h1>
    <router-link class="btn" to="/farmaceuticos/nuevo">Nuevo farmaceutico</router-link>
  </div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Colegiado</th>
          <th>Turno</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="estado.farmaceuticos.length === 0">
          <td colspan="5" class="vacio">No hay farmaceuticos.</td>
        </tr>
        <tr v-for="persona in estado.farmaceuticos" :key="persona.id">
          <td>{{ persona.id }}</td>
          <td>{{ persona.nombre }}</td>
          <td>{{ persona.colegiado }}</td>
          <td>{{ persona.turno }}</td>
          <td class="actions">
            <button class="btn btn-secondary btn-small" type="button" @click="router.push(`/farmaceuticos/${persona.id}/editar`)">
              Editar
            </button>
            <button class="btn btn-danger btn-small" type="button" @click="eliminar(persona.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

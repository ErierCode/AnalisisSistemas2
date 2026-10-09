<script setup>
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerFarmaceutico, guardarFarmaceutico, ok, fail, limpiarAviso } from '../store'

const route = useRoute()
const router = useRouter()
const turnos = ['Matutino', 'Vespertino', 'Nocturno']

const form = reactive({
  id: null,
  nombre: '',
  colegiado: '',
  turno: 'Matutino',
})

function cargar() {
  limpiarAviso()
  Object.assign(form, { id: null, nombre: '', colegiado: '', turno: 'Matutino' })
  if (!route.params.id) return
  try {
    Object.assign(form, obtenerFarmaceutico(route.params.id))
  } catch (error) {
    fail(error.message)
    router.push('/farmaceuticos')
  }
}

watch(() => route.params.id, cargar, { immediate: true })

function guardar() {
  try {
    const eraEdicion = Boolean(form.id)
    guardarFarmaceutico({ ...form })
    ok(eraEdicion ? 'Farmaceutico actualizado.' : 'Farmaceutico guardado.')
    router.push('/farmaceuticos')
  } catch (error) {
    fail(error.message)
  }
}
</script>

<template>
  <div class="card">
    <h1>{{ form.id ? 'Editar farmaceutico' : 'Nuevo farmaceutico' }}</h1>
    <form @submit.prevent="guardar">
      <label>Nombre</label>
      <input v-model="form.nombre" type="text" required />
      <label>Numero de colegiado</label>
      <input v-model="form.colegiado" type="text" required placeholder="COL-3001" />
      <label>Turno</label>
      <select v-model="form.turno" required>
        <option v-for="turno in turnos" :key="turno" :value="turno">{{ turno }}</option>
      </select>
      <p class="actions" style="margin-top: 1rem;">
        <button class="btn" type="submit">Guardar</button>
        <router-link class="btn btn-secondary" to="/farmaceuticos">Cancelar</router-link>
      </p>
    </form>
  </div>
</template>

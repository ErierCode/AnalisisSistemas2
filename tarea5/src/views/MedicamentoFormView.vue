<script setup>
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerMedicamento, guardarMedicamento, ok, fail, limpiarAviso } from '../store'

const route = useRoute()
const router = useRouter()
const presentaciones = ['Tabletas', 'Capsulas', 'Jarabe', 'Crema', 'Inyectable', 'Gotas']

const form = reactive({
  id: null,
  codigo: '',
  nombre: '',
  principioActivo: '',
  presentacion: 'Tabletas',
  stock: 0,
  precio: 0,
  requiereReceta: false,
})

function cargar() {
  limpiarAviso()
  Object.assign(form, {
    id: null,
    codigo: '',
    nombre: '',
    principioActivo: '',
    presentacion: 'Tabletas',
    stock: 0,
    precio: 0,
    requiereReceta: false,
  })
  if (!route.params.id) return
  try {
    Object.assign(form, obtenerMedicamento(route.params.id))
  } catch (error) {
    fail(error.message)
    router.push('/medicamentos')
  }
}

watch(() => route.params.id, cargar, { immediate: true })

function guardar() {
  try {
    const eraEdicion = Boolean(form.id)
    guardarMedicamento({ ...form })
    ok(eraEdicion ? 'Medicamento actualizado.' : 'Medicamento guardado.')
    router.push('/medicamentos')
  } catch (error) {
    fail(error.message)
  }
}
</script>

<template>
  <div class="card">
    <h1>{{ form.id ? 'Editar medicamento' : 'Nuevo medicamento' }}</h1>
    <form @submit.prevent="guardar">
      <label>Codigo</label>
      <input v-model="form.codigo" type="text" required placeholder="MED-010" />
      <label>Nombre</label>
      <input v-model="form.nombre" type="text" required />
      <label>Principio activo</label>
      <input v-model="form.principioActivo" type="text" required />
      <label>Presentacion</label>
      <select v-model="form.presentacion" required>
        <option v-for="opcion in presentaciones" :key="opcion" :value="opcion">{{ opcion }}</option>
      </select>
      <label>Stock</label>
      <input v-model.number="form.stock" type="number" min="0" step="1" required />
      <label>Precio (Q)</label>
      <input v-model.number="form.precio" type="number" min="0.01" step="0.01" required />
      <label class="check">
        <input v-model="form.requiereReceta" type="checkbox" />
        Requiere receta
      </label>
      <p class="actions" style="margin-top: 1rem;">
        <button class="btn" type="submit">Guardar</button>
        <router-link class="btn btn-secondary" to="/medicamentos">Cancelar</router-link>
      </p>
    </form>
  </div>
</template>

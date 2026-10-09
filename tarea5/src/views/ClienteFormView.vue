<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerCliente, guardarCliente, ok, fail, limpiarAviso } from '../store'

const route = useRoute()
const router = useRouter()

const form = reactive({
  id: null,
  nombre: '',
  telefono: '',
  correo: '',
})

const titulo = computed(() => (route.params.id ? 'Editar cliente' : 'Nuevo cliente'))

function cargar() {
  limpiarAviso()
  form.id = null
  form.nombre = ''
  form.telefono = ''
  form.correo = ''
  if (!route.params.id) return
  try {
    const cliente = obtenerCliente(route.params.id)
    form.id = cliente.id
    form.nombre = cliente.nombre
    form.telefono = cliente.telefono
    form.correo = cliente.correo
  } catch (error) {
    fail(error.message)
    router.push('/clientes')
  }
}

watch(() => route.params.id, cargar, { immediate: true })

function guardar() {
  try {
    guardarCliente({ ...form })
    ok(form.id ? 'Cliente actualizado.' : 'Cliente guardado.')
    router.push('/clientes')
  } catch (error) {
    fail(error.message)
  }
}
</script>

<template>
  <div class="card">
    <h1>{{ titulo }}</h1>
    <form @submit.prevent="guardar">
      <label>Nombre</label>
      <input v-model="form.nombre" type="text" required />
      <label>Telefono</label>
      <input v-model="form.telefono" type="text" />
      <label>Correo</label>
      <input v-model="form.correo" type="email" />
      <p class="actions" style="margin-top: 1rem;">
        <button class="btn" type="submit">Guardar</button>
        <router-link class="btn btn-secondary" to="/clientes">Cancelar</router-link>
      </p>
    </form>
  </div>
</template>

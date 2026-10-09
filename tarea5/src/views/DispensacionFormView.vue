<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  estado,
  obtenerDispensacion,
  guardarDispensacion,
  formatearMoneda,
  ok,
  fail,
  limpiarAviso,
} from '../store'

const route = useRoute()
const router = useRouter()

const form = reactive({
  id: null,
  clienteId: '',
  medicamentoId: '',
  farmaceuticoId: '',
  cantidad: 1,
  numeroReceta: '',
  indicaciones: '',
  estado: '',
})

const medicamento = computed(() =>
  estado.medicamentos.find((item) => item.id === Number(form.medicamentoId)),
)

const total = computed(() => {
  if (!medicamento.value) return 0
  const cantidad = Number(form.cantidad) || 0
  return medicamento.value.precio * cantidad
})

function cargar() {
  limpiarAviso()
  Object.assign(form, {
    id: null,
    clienteId: '',
    medicamentoId: '',
    farmaceuticoId: '',
    cantidad: 1,
    numeroReceta: '',
    indicaciones: '',
    estado: '',
  })
  if (!route.params.id) return
  try {
    const item = obtenerDispensacion(route.params.id)
    Object.assign(form, {
      id: item.id,
      clienteId: item.clienteId,
      medicamentoId: item.medicamentoId,
      farmaceuticoId: item.farmaceuticoId,
      cantidad: item.cantidad,
      numeroReceta: item.numeroReceta,
      indicaciones: item.indicaciones,
      estado: item.estado,
    })
  } catch (error) {
    fail(error.message)
    router.push('/dispensaciones')
  }
}

watch(() => route.params.id, cargar, { immediate: true })

function guardar() {
  try {
    const eraEdicion = Boolean(form.id)
    guardarDispensacion({ ...form })
    ok(eraEdicion ? 'Dispensacion actualizada.' : 'Dispensacion registrada. El stock fue descontado.')
    router.push('/dispensaciones')
  } catch (error) {
    fail(error.message)
  }
}
</script>

<template>
  <div class="card">
    <h1>{{ form.id ? 'Editar dispensacion' : 'Nueva dispensacion' }}</h1>
    <p v-if="form.estado" class="muted">Estado actual: {{ form.estado }}. El avance de estado se hace desde la lista.</p>
    <form @submit.prevent="guardar">
      <label>Cliente</label>
      <select v-model="form.clienteId" required>
        <option value="">Seleccione un cliente</option>
        <option v-for="cliente in estado.clientes" :key="cliente.id" :value="cliente.id">
          {{ cliente.nombre }}
        </option>
      </select>
      <label>Medicamento</label>
      <select v-model="form.medicamentoId" required>
        <option value="">Seleccione un medicamento</option>
        <option v-for="item in estado.medicamentos" :key="item.id" :value="item.id">
          {{ item.codigo }} - {{ item.nombre }} (stock {{ item.stock }})
        </option>
      </select>
      <p v-if="medicamento" class="muted">
        Precio {{ formatearMoneda(medicamento.precio) }}.
        {{ medicamento.requiereReceta ? 'Requiere receta.' : 'Venta libre.' }}
      </p>
      <label>Farmaceutico</label>
      <select v-model="form.farmaceuticoId" required>
        <option value="">Seleccione un farmaceutico</option>
        <option v-for="persona in estado.farmaceuticos" :key="persona.id" :value="persona.id">
          {{ persona.nombre }} ({{ persona.turno }})
        </option>
      </select>
      <label>Cantidad</label>
      <input v-model.number="form.cantidad" type="number" min="1" step="1" required />
      <label>Numero de receta</label>
      <input v-model="form.numeroReceta" type="text" placeholder="Obligatorio si el medicamento requiere receta" />
      <label>Indicaciones</label>
      <textarea v-model="form.indicaciones" rows="3" required></textarea>
      <p><strong>Total: {{ formatearMoneda(total) }}</strong></p>
      <p class="actions">
        <button class="btn" type="submit">Guardar</button>
        <router-link class="btn btn-secondary" to="/dispensaciones">Cancelar</router-link>
      </p>
    </form>
  </div>
</template>

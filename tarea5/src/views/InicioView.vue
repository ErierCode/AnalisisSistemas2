<script setup>
import { computed } from 'vue'
import { estado, restaurarDatos, ok } from '../store'

const stockBajo = computed(() => estado.medicamentos.filter((item) => item.stock > 0 && item.stock <= 8).length)
const agotados = computed(() => estado.medicamentos.filter((item) => item.stock === 0).length)
const pendientes = computed(() => estado.dispensaciones.filter((item) => item.estado !== 'ENTREGADA').length)

function restaurar() {
  if (!window.confirm('Esto borra los cambios y vuelve a cargar los datos de ejemplo. Continuar?')) return
  restaurarDatos()
  ok('Datos de ejemplo restaurados.')
}
</script>

<template>
  <div class="card">
    <h1>Sistema de Farmacia</h1>
    <p class="muted">
      Demo educativa con Vue.js. Gestiona clientes, medicamentos, farmaceuticos y dispensaciones.
      Los datos se guardan en el navegador.
    </p>
  </div>

  <div class="grid" style="margin-bottom: 1rem;">
    <div class="stat">
      Clientes
      <strong>{{ estado.clientes.length }}</strong>
    </div>
    <div class="stat">
      Medicamentos
      <strong>{{ estado.medicamentos.length }}</strong>
    </div>
    <div class="stat">
      Stock bajo
      <strong>{{ stockBajo }}</strong>
    </div>
    <div class="stat">
      Agotados
      <strong>{{ agotados }}</strong>
    </div>
    <div class="stat">
      Dispensaciones abiertas
      <strong>{{ pendientes }}</strong>
    </div>
  </div>

  <div class="grid">
    <router-link class="module-link" to="/clientes">
      Clientes
      <span>Registro de personas que retiran medicamentos.</span>
    </router-link>
    <router-link class="module-link" to="/medicamentos">
      Medicamentos
      <span>Catalogo, precio, stock y si exige receta.</span>
    </router-link>
    <router-link class="module-link" to="/farmaceuticos">
      Farmaceuticos
      <span>Personal que prepara y entrega.</span>
    </router-link>
    <router-link class="module-link" to="/dispensaciones">
      Dispensaciones
      <span>Solicitada, preparada y entregada.</span>
    </router-link>
  </div>

  <div class="card">
    <h2>Reglas de negocio</h2>
    <ul class="muted">
      <li>El codigo del medicamento y el colegiado del farmaceutico son unicos.</li>
      <li>No se elimina un cliente, medicamento o farmaceutico si tiene dispensaciones.</li>
      <li>Al registrar una dispensacion se descuenta el stock. Al eliminarla, se devuelve.</li>
      <li>Si el medicamento requiere receta, el numero de receta es obligatorio.</li>
      <li>El estado avanza solo en orden: SOLICITADA, PREPARADA, ENTREGADA.</li>
    </ul>
    <button class="btn btn-secondary" type="button" @click="restaurar">Restaurar datos de ejemplo</button>
  </div>
</template>

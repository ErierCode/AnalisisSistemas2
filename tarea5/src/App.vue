<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { aviso, limpiarAviso } from './store'

const route = useRoute()

const enlaces = [
  { to: '/', texto: 'Inicio' },
  { to: '/clientes', texto: 'Clientes' },
  { to: '/medicamentos', texto: 'Medicamentos' },
  { to: '/farmaceuticos', texto: 'Farmaceuticos' },
  { to: '/dispensaciones', texto: 'Dispensaciones' },
]

function activo(ruta) {
  if (ruta === '/') return route.path === '/'
  return route.path.startsWith(ruta)
}

const hayAviso = computed(() => aviso.mensaje || aviso.error)
</script>

<template>
  <nav class="navbar">
    <router-link
      v-for="enlace in enlaces"
      :key="enlace.to"
      :to="enlace.to"
      :class="{ activo: activo(enlace.to) }"
      @click="limpiarAviso"
    >
      {{ enlace.texto }}
    </router-link>
  </nav>
  <main class="container">
    <div v-if="hayAviso && aviso.mensaje" class="alert alert-ok">{{ aviso.mensaje }}</div>
    <div v-if="hayAviso && aviso.error" class="alert alert-error">{{ aviso.error }}</div>
    <router-view />
  </main>
</template>

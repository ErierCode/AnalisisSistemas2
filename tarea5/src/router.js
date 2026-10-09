import { createRouter, createWebHistory } from 'vue-router'
import InicioView from './views/InicioView.vue'
import ClientesView from './views/ClientesView.vue'
import ClienteFormView from './views/ClienteFormView.vue'
import MedicamentosView from './views/MedicamentosView.vue'
import MedicamentoFormView from './views/MedicamentoFormView.vue'
import FarmaceuticosView from './views/FarmaceuticosView.vue'
import FarmaceuticoFormView from './views/FarmaceuticoFormView.vue'
import DispensacionesView from './views/DispensacionesView.vue'
import DispensacionFormView from './views/DispensacionFormView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'inicio', component: InicioView },
    { path: '/clientes', name: 'clientes', component: ClientesView },
    { path: '/clientes/nuevo', name: 'cliente-nuevo', component: ClienteFormView },
    { path: '/clientes/:id/editar', name: 'cliente-editar', component: ClienteFormView },
    { path: '/medicamentos', name: 'medicamentos', component: MedicamentosView },
    { path: '/medicamentos/nuevo', name: 'medicamento-nuevo', component: MedicamentoFormView },
    { path: '/medicamentos/:id/editar', name: 'medicamento-editar', component: MedicamentoFormView },
    { path: '/farmaceuticos', name: 'farmaceuticos', component: FarmaceuticosView },
    { path: '/farmaceuticos/nuevo', name: 'farmaceutico-nuevo', component: FarmaceuticoFormView },
    { path: '/farmaceuticos/:id/editar', name: 'farmaceutico-editar', component: FarmaceuticoFormView },
    { path: '/dispensaciones', name: 'dispensaciones', component: DispensacionesView },
    { path: '/dispensaciones/nuevo', name: 'dispensacion-nueva', component: DispensacionFormView },
    { path: '/dispensaciones/:id/editar', name: 'dispensacion-editar', component: DispensacionFormView },
  ],
})

import { createRouter, createWebHistory } from 'vue-router';
import Inicio from './components/Inicio.vue';
import Animacion from './components/animacion.vue';
import menu from './components/menu.vue';
import Login from './components/login.vue';
import panel from './components/panel.vue';
import panel_admin from './components/panel_admin.vue';
import panel_jefe from './components/panel_jefe.vue';
import HojaServicio from './components/hoja_servicio.vue';
import DetallesEquipo from './components/detalles_equipo.vue';
import TuEquipo from './components/tu_equipo.vue';
import Admin from './components/admin.vue';
import Altaservicio from './components/alta_servicio.vue';
import servicio from './components/servicio.vue';
import cotizacion from './components/cotizacion.vue';
import hoja_servicio_print from './components/hoja_servicio_print.vue';
import trabajadores from './components/trabajadores.vue';
import servicios_eliminados from './components/servicios_eliminados.vue';
import { components } from 'vuetify/dist/vuetify-labs.js';

const routes = [
  { path: '/', name: 'Inicio', component: Inicio },
  { path: '/animacion', name: 'Animacion', component: Animacion },
  { path: '/menu', name: 'menu', component: menu },
  { path: '/login', name: 'Login', component: Login },
  { path: '/panel', name: 'panel', component: panel, meta: { requiresAuth: true } },
  { path: '/panel_admin', name: 'panel_admin', component: panel_admin, meta: { requiresAuth: true } },
  { path: '/panel_jefe', name: 'panel_jefe', component: panel_jefe, meta: { requiresAuth: true } },
  { path: '/hoja_servicio', name: 'HojaServicio', component: HojaServicio, meta: { requiresAuth: true } },
  { path: '/detalles_equipo', name: 'detalles_equipo', component: DetallesEquipo, props: true, meta: { requiresAuth: true } },
  { path: '/tu_equipo', name: 'tu_equipo', component: TuEquipo, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/altaServicio', name: 'alta_servicio', component: Altaservicio, meta: { requiresAuth: true } },
  { path: '/Servicio', name: 'servicio', component: servicio, meta: { requiresAuth: true } },
  { path: '/Cotizacion', name: 'cotizacion', component: cotizacion, meta: { requiresAuth: true } },

  { path: '/hoja_servicio_print/:idServicio', name: 'hoja_servicio_print', component: hoja_servicio_print, meta: { requiresAuth: true } },
  { path: '/Trabajadores', name: 'Trabajadores', component: trabajadores, meta: { requiresAuth: true } },
  { path: '/servicios_eliminados', name: 'ServiciosEliminados', component: servicios_eliminados, meta: { requiresAuth: true } },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global para redirecciones personalizadas
router.beforeEach((to, from, next) => {
  const userId = localStorage.getItem('userId');

  // Redirigir a /panel_jefe si el usuario es el jefe y va a /panel
  if (to.path === '/panel' && userId === '1') {
    return next('/panel_jefe');
  }

  // Continuar con la navegación si no hay redirección
  next();
});

export default router;

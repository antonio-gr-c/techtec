import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Carga de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // JS de Bootstrap que incluye Popper.js

// Crear la instancia de la app
const app = createApp(App);

// Usar el enrutador
app.use(router);

// Montar la aplicación
app.mount('#app');
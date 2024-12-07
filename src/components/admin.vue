<template>
  <!-- Div contenedor con color de fondo negro -->
  <div class="main-container">
    <!-- Logo y secciones de drag and drop dentro del contenedor negro -->
    <div class="inner-container">
      <!-- Logo -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-6 text-center">
          <img
            src="https://i.postimg.cc/rpZKd7mT/Dise-o-sin-t-tulo-3.png"
            alt="Logo"
            class="logo img-fluid mb-4"
          />
        </div>
      </div>

      <!-- Secciones de drag and drop con scroll horizontal -->
      <div class="drag-container">
        <!-- Equipos Recien Ingresados -->
        <div class="col-md-2">
          <h5 class="column-title">Equipos Recien Ingresados</h5>
          <draggable
            class="list-group"
            v-model="equiposRecienIngresados"
            group="equipos"
            @end="onDragEnd"
            item-key="nombre"
          >
            <template #item="{ element }">
              <div
                class="list-group-item draggable-item d-flex justify-content-between align-items-center"
              >
                {{ element.nombre }}
                <button @click="openModal(element)" class="btn btn-sm btn-primary">
                  Detalles
                </button>
              </div>
            </template>
          </draggable>
        </div>

        <!-- Equipos en Stand By -->
        <div class="col-md-2">
          <h5 class="column-title">Equipos en Stand By</h5>
          <draggable
            class="list-group"
            v-model="equiposStandBy"
            group="equipos"
            @end="onDragEnd"
            item-key="nombre"
          >
            <template #item="{ element }">
              <div
                class="list-group-item draggable-item d-flex justify-content-between align-items-center"
              >
                {{ element.nombre }}
                <button @click="openModal(element)" class="btn btn-sm btn-primary">
                  Detalles
                </button>
              </div>
            </template>
          </draggable>
        </div>

        <!-- Trabajador 1 -->
        <div class="col-md-2">
          <h5 class="column-title">Trabajador 1</h5>
          <draggable
            class="list-group"
            v-model="trabajador1Equipos"
            group="equipos"
            @end="onDragEnd"
            item-key="nombre"
          >
            <template #item="{ element }">
              <div
                class="list-group-item draggable-item d-flex justify-content-between align-items-center"
              >
                {{ element.nombre }}
                <button @click="openModal(element)" class="btn btn-sm btn-primary">
                  Detalles
                </button>
              </div>
            </template>
          </draggable>
        </div>

        <!-- Trabajador 2 -->
        <div class="col-md-2">
          <h5 class="column-title">Trabajador 2</h5>
          <draggable
            class="list-group"
            v-model="trabajador2Equipos"
            group="equipos"
            @end="onDragEnd"
            item-key="nombre"
          >
            <template #item="{ element }">
              <div
                class="list-group-item draggable-item d-flex justify-content-between align-items-center"
              >
                {{ element.nombre }}
                <button @click="openModal(element)" class="btn btn-sm btn-primary">
                  Detalles
                </button>
              </div>
            </template>
          </draggable>
        </div>

        <!-- Equipos Finalizados -->
        <div class="col-md-2">
          <h5 class="column-title">Equipos Finalizados</h5>
          <draggable
            class="list-group"
            v-model="equiposFinalizados"
            group="equipos"
            @end="onDragEnd"
            item-key="nombre"
          >
            <template #item="{ element }">
              <div
                class="list-group-item draggable-item d-flex justify-content-between align-items-center"
              >
                {{ element.nombre }}
                <button @click="openModal(element)" class="btn btn-sm btn-primary">
                  Detalles
                </button>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <!-- Modal para Detalles del Equipo -->
    <div
      class="modal fade"
      id="equipoModal"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">{{ equipoSeleccionado.nombre }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>Descripción del equipo:</strong> {{ equipoSeleccionado.descripcion }}</p>
            <p><strong>Errores Reportados:</strong></p>
            <ul>
              <li v-for="(error, index) in equipoSeleccionado.errores" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      equiposRecienIngresados: [
        { nombre: 'Equipo 1', descripcion: 'Laptop Dell', errores: ['Pantalla dañada', 'No enciende'] },
        { nombre: 'Equipo 2', descripcion: 'Smartphone Samsung', errores: ['Batería no carga'] },
        { nombre: 'Equipo 3', descripcion: 'Tablet Apple', errores: ['Pantalla rota'] },
      ],
      equiposStandBy: [],
      trabajador1Equipos: [],
      trabajador2Equipos: [],
      equiposFinalizados: [],
      equipoSeleccionado: {},
    };
  },
  methods: {
    onDragEnd(event) {
      console.log('Drag Ended: ', event);
    },
    openModal(equipo) {
      this.equipoSeleccionado = equipo;
      const modal = new Modal(document.getElementById('equipoModal'));
      modal.show();
    },
  },
};
</script>

<style scoped>
/* Contenedor principal con fondo oscuro y ajuste de padding */
.main-container {
  color: #f8f9fa; 
  padding: 20px;
  height: 100vh; 
  overflow-y: auto; 
}

/* Contenedor interno que organiza el contenido */
.inner-container {
  flex-direction: column;
  align-items: center;
  padding-left: 20px;
  height: 800px;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.575);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.719);
}

/* Estilo del logo */
.logo {
  max-width: 200px; 
  height: auto;
}

/* Títulos de columnas */
.column-title {
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
}

/* Contenedor para las columnas de drag-and-drop con scroll horizontal */
.drag-container {
  display: flex;
  justify-content: flex-start;
  overflow-x: auto; 
  width: 100%; 
  padding-bottom: 20px;
}

/* Listas del drag-and-drop */
.list-group {
  padding: 10px;
  border-radius: 8px;
  max-height: 350px; 
  overflow-y: auto; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin: 0 10px;
  min-width: 200px; 
}

/* Estilo de los elementos arrastrables */
.draggable-item {
  background-color: #1a1a1a;
  color: #ffffff; 
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: move;
  transition: transform 0.2s ease;
}

.draggable-item:hover {
  transform: scale(1.05);
}

.modal-content {
  background-color: #2c2c2c;
  color: #f8f9fa;
}

.modal-header, .modal-footer {
  border-color: #444;
}
</style>

<template>
  <div class="details-container">
    <h1>Detalles del Equipo</h1>
    <div v-if="equipo" class="details-content">
      <!-- Carrusel de fotos (sin cambios) -->
      <div id="carouselPhotos" class="carousel slide">
        <div class="carousel-inner">
          <div
            v-for="(photo, index) in equipo.fotos"
            :key="index"
            class="carousel-item"
            :class="{ active: index === 0 }"
          >
            <img :src="photo" class="d-block w-100" alt="Imagen del equipo" />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselPhotos"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselPhotos"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <!-- Detalles del equipo (sin cambios) -->
      <div class="detail-list">
        <div class="detail-item">
          <span class="label">Nombre:</span>
          <span class="value">{{ equipo.nombre }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Modelo:</span>
          <span class="value">{{ equipo.modelo }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Estado:</span>
          <span class="value">{{ equipo.estado }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Última revisión:</span>
          <span class="value">{{ equipo.ultimaRevision }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Propietario:</span>
          <span class="value">{{ equipo.propietario }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Número:</span>
          <span class="value">{{ equipo.numero }}</span>
        </div>
      </div>

      <!-- Descripción del problema -->
      <div class="detail-item">
        <span class="label">Descripción del problema:</span>
        <textarea v-model="descripcionProblema" disabled rows="3"></textarea>
      </div>

      <!-- Nueva Sección de Servicio -->
      <div class="maintenance-section">
        <h2>Servicio</h2>

        <!-- Formulario para agregar un nuevo paso -->
        <div class="new-step">
          <h3>Agregar nuevo paso</h3>
          <div class="form-group">
            <label for="nombrePaso">Nombre del paso:</label>
            <input type="text" v-model="nuevoPaso.nombre" id="nombrePaso" />
          </div>
          <div class="form-group">
            <label for="descripcionGeneral">Descripción general:</label>
            <input type="text" v-model="nuevoPaso.descripcionGeneral" id="descripcionGeneral" />
          </div>
          <div class="form-group">
            <label for="descripcionDetallada">Descripción detallada:</label>
            <textarea v-model="nuevoPaso.descripcionDetallada" id="descripcionDetallada" rows="3"></textarea>
          </div>
          <button @click="agregarPaso" class="add-step-button">Agregar paso</button>
        </div>

        <!-- Lista de pasos añadidos con opciones para ver detalles, cambiar estado, editar y abrir modal -->
        <h3>Pasos del Servicio</h3>
        <ul>
          <li v-for="(paso, index) in pasos" :key="index" class="step-item">
            <div class="step-header">
              <span>{{ paso.nombre }}</span>

              <!-- Botón para cambiar estado del paso -->
              <button @click="cambiarEstado(paso)" class="add-step-button">
                {{ estadoTexto(paso.estado) }}
              </button>

              <!-- Botón para ver el modal de detalles -->
              <button @click="abrirModal(paso)" class="add-step-button">Ver Detalles</button>

              <!-- Botón para editar el paso -->
              <button @click="editarPaso(index)" class="add-step-button">Editar</button>
            </div>
          </li>
        </ul>

        <!-- Botón para confirmar todos los cambios -->
        <button @click="confirmarCambios" class="add-step-button">Subir informe</button>

        <!-- Modal para ver detalles del paso -->
        <div v-if="mostrarModal" class="modal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Detalles del Paso</h5>
                <button type="button" class="btn-close" @click="cerrarModal"></button>
              </div>
              <div class="modal-body">
                <p><strong>Descripción general:</strong> {{ pasoActual.descripcionGeneral }}</p>
                <p><strong>Descripción detallada:</strong> {{ pasoActual.descripcionDetallada }}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button @click="irCotizacion" class="back-button">Ir a Cotización</button>
      <button @click="goBack" class="back-button">Volver</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      equipo: null,
      descripcionProblema: 'Pantalla rota debido a caída. Se requiere diagnóstico y reparación completa.',
      nuevoPaso: {
        nombre: '',
        descripcionGeneral: '',
        descripcionDetallada: '',
      },
      pasos: [],
      mostrarModal: false,
      pasoActual: {},
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.updateEquipo();
    });
  },
  methods: {
    irCotizacion() {
      this.$router.push({ name: 'cotizacion' });
    },
    updateEquipo() {
      this.equipo = this.getEquipo();
    },
    getEquipo() {
      return {
        nombre: 'Laptop Msi',
        modelo: 'Msi Gf63',
        estado: 'En reparación',
        ultimaRevision: '2024-09-16',
        propietario: 'Tadeo Martinez',
        numero: '951 396 9605',
        fotos: [
          'https://http2.mlstatic.com/D_NQ_NP_2X_839299-MLM73906886025_012024-F.webp',
          'https://http2.mlstatic.com/D_NQ_NP_2X_979819-MLM75962726731_042024-F.webp',
          'https://http2.mlstatic.com/D_NQ_NP_2X_622676-MLM75792648390_042024-F.webp',
        ],
      };
    },
    agregarPaso() {
      if (
        this.nuevoPaso.nombre !== '' &&
        this.nuevoPaso.descripcionGeneral !== '' &&
        this.nuevoPaso.descripcionDetallada !== ''
      ) {
        this.pasos.push({ ...this.nuevoPaso, estado: 'standby' });
        this.nuevoPaso = { nombre: '', descripcionGeneral: '', descripcionDetallada: '' };
      } else {
        alert('Por favor completa todos los campos para agregar un nuevo paso.');
      }
    },
    cambiarEstado(paso) {
      if (paso.estado === 'standby') {
        paso.estado = 'inProgress';
      } else if (paso.estado === 'inProgress') {
        paso.estado = 'completed';
      } else {
        paso.estado = 'standby';
      }
    },
    estadoTexto(estado) {
      if (estado === 'standby') {
        return 'En espera';
      } else if (estado === 'inProgress') {
        return 'En proceso';
      } else if (estado === 'completed') {
        return 'Completado';
      }
    },
    abrirModal(paso) {
      this.pasoActual = paso;
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    editarPaso(index) {
      const paso = this.pasos[index];
      this.nuevoPaso = { ...paso };
      this.pasos.splice(index, 1); // Eliminamos el paso para reemplazarlo al editar
    },
    confirmarCambios() {
      // Aquí puedes manejar la lógica para enviar los datos al backend o simplemente confirmarlos.
      alert('Todos los cambios han sido confirmados y enviados.');
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
/* Estilos */
.completed {
  text-decoration: line-through;
}

.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #343a40;
  color: #fff;
}

.modal-header {
  border-bottom: 1px solid #343a40;
}

.modal-footer {
  border-top: 1px solid #343a40;
}

.confirm-button {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
.back-button {
  margin-top: 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

  .details-container {
    padding: 30px;
    background-color: #1a1a1a;
    color: #f1f1f1;
    border-radius: 10px;
    max-width: 800px;
    margin: 20px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .details-container h1,
  .details-container h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  
  .carousel {
    margin-bottom: 20px;
  }
  
  .carousel-inner img {
    border-radius: 5px;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    filter: invert(1);
  }
  
  .details-content {
    display: flex;
    flex-direction: column;
  }
  
  .detail-list {
    margin-top: 20px;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px;
    background-color: #2a2a2a;
    border-radius: 5px;
  }
  
  .label {
    font-weight: bold;
    color: #c0c0c0;
  }
  
  .value {
    color: #e0e0e0;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    background-color: #2a2a2a;
    color: #e0e0e0;
    border: 1px solid #444;
    border-radius: 5px;
    resize: none;
  }
  
  .maintenance-section {
    margin-top: 40px;
    background-color: #2a2a2a;
    padding: 20px;
    border-radius: 10px;
  }
  
  .maintenance-section ul {
    list-style: none;
    padding: 0;
  }
  
  .maintenance-section li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .maintenance-section input[type="checkbox"] {
    margin-right: 10px;
  }
  
  .maintenance-section .completed {
    text-decoration: line-through;
    color: #808080;
  }
  
  .submit-button {
    display: block;
    width: 100%;
    padding: 12px;
    margin-top: 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #218838;
    transform: scale(1.05);
  }
  
  .back-button {
    display: block;
    width: 100%;
    padding: 12px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .back-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  
  .tooltip {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  /* Sección de mantenimiento con estilo adicional */
.maintenance-section {
  margin-top: 40px;
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 10px;
}

.new-step {
  background-color: #333;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.new-step h3 {
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #f1f1f1;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  background-color: #444;
  color: #f1f1f1;
  border: none;
  border-radius: 5px;
}

.add-step-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.add-step-button:hover {
  background-color: #218838;
}

.step-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #333;
  border-radius: 5px;
}

.step-header {
  display: flex;
  align-items: center;
}

.step-header input[type="checkbox"] {
  margin-right: 10px;
}

.step-header .completed {
  text-decoration: line-through;
  color: #808080;
}
  
  </style>
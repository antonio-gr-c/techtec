<template>
  <div class="container">
    <div class="window">
      <img src="https://i.postimg.cc/rpZKd7mT/Dise-o-sin-t-tulo-3.png" alt="Logo" class="top-left-image" />

      <a href="/" rel="noopener noreferrer" class="enter-button-container">
        <span class="material-symbols-outlined enter-button">east</span>
      </a>

      <div class="content-wrapper">
        <!-- Contenido del lado izquierdo -->
        <div class="cabeza">
          <h2>Estado de tu equipo</h2>
          <p class="text">
            A continuación te mostramos el progreso del servicio de tu equipo.
          </p>

          <div class="search-container">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Buscar otro equipo..." 
              v-model="numeroServicio" 
            />
            <button class="search-button" @click="buscar">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>

        <!-- Contenido del lado derecho -->
        <div class="tracking-menu">
          <div class="estimated-time">
            <span class="estimated-label">Tiempo de entrega estimado:</span> 
            <span class="estimated-value">{{ estimatedTime }}</span>
          </div>

          <div
            v-for="(step, index) in trackingSteps.slice(-4).reverse()"
            :key="step.title"
            :class="['tracking-step', index === 0 ? 'current' : 'previous']"
          >
            <div class="step-indicator"></div>
            <div class="step-label-container">
              <span class="step-label">
                Estado {{ index === 0 ? 'Actual' : 'Anterior' }}: {{ step.title }}
              </span>
            </div>
          </div>
          <div class="botones">
            <button class="confirm-quote-button" @click="openFullTrackingModal">
              <span class="material-symbols-outlined">table_eye</span>
            </button>
            <button @click="verCotizaciones" class="confirm-quote-button">
              <span class="material-symbols-outlined">construction</span>
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="fullTrackingModal" ref="fullTrackingModal" tabindex="-1" role="dialog" aria-labelledby="fullTrackingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title" id="fullTrackingModalLabel">Seguimiento Completo</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeFullTrackingModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
              <table class="table table-dark table-striped">
                <thead>
                  <tr>
                    <th>Punto de seguimiento</th>
                    <th>Costo Estimado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="step in trackingSteps" :key="step.title">
                    <td>
                      <strong>{{ step.title }}</strong>
                      <p><small>{{ step.details }}</small></p>
                    </td>
                    <td>{{ step.estimatedCost }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">

            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="cotizacionesModal"
        tabindex="-1"
        aria-labelledby="cotizacionesModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title" id="fullTrackingModalLabel">Cotizaciones</h5>
              <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close" @click="cerrarCotizaciones">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
              <!-- Tabla de cotizaciones -->
              <table class="table table-dark table-striped">
                <thead>
                  <tr>
                    <th>Nombre de la Pieza</th>
                    <th>Costo</th>
                    <th>Estado de la Cotización</th>
                    <th>Observaciones</th>
                    <th>Tiempo de Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cotizaciones in ordenCotizaciones" :key="cotizaciones.idPieza">
                    <td 
                      :class="{
                        'cancelada': cotizaciones.cancelacion === 'cancelado'
                      }"
                    >{{ cotizaciones.nombre }}</td>
                    <td 
                      :class="{
                        'cancelada': cotizaciones.cancelacion === 'cancelado'
                      }"
                    >{{ cotizaciones.costo }}</td>
                    <td 
                      :class="{
                        'cancelada': cotizaciones.cancelacion === 'cancelado'
                      }"
                    >{{ cotizaciones.estado }}</td>
                    <td 
                      :class="{
                        'cancelada': cotizaciones.cancelacion === 'cancelado'
                      }"
                    >{{ cotizaciones.observaciones }}</td>
                    <td 
                      :class="{
                        'cancelada': cotizaciones.cancelacion === 'cancelado'
                      }"
                    >{{ cotizaciones.tiempo_entrega }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <!-- Pie del modal si es necesario -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      estimatedTime: '',
      trackingSteps: [],
      numeroServicio: '',
      servicios: [],
      cotizaciones: [],
      claves: [], // Array para almacenar las claves
      idServicio: null,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  created() {
    // Llamamos a cargar las claves y servicios en 'created' para asegurarnos de que todo esté listo antes de hacer la verificación
    this.cargarClaves().then(() => {
      this.cargarServicios().then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const idServicio = urlParams.get('id_servicio');
      
        if (idServicio) {
          this.numeroServicio = idServicio;
          this.buscar();
        }
      });
    });
  },
  computed: {
    // Computed property para ordenar las cotizaciones, moviendo las canceladas al final
    ordenCotizaciones() {
      // Ordenamos primero las cotizaciones no canceladas y luego las canceladas
      return [
        ...this.cotizaciones.filter(cot => cot.cancelacion !== 'cancelado'),
        ...this.cotizaciones.filter(cot => cot.cancelacion === 'cancelado')
      ];
    },
  },
  methods: {

    async cargarClaves() {
    try {
      const response = await axios.get('http://localhost:3000/api/generar-claves'); // Llamar al endpoint que genera las claves
      this.claves = response.data; // Almacenar las claves generadas en el array
      
      this.verificarClave(); // Llamamos a la función que verifica la clave
    } catch (error) {
      console.error('Error al cargar las claves:', error);
    }
  },

  verificarClave() {
    // Obtener la clave del link
    const urlParams = new URLSearchParams(window.location.search); // Usamos URLSearchParams para obtener parámetros de la URL
    const claveDelLink = urlParams.get('clave'); // Obtenemos la clave desde la URL

    

    if (claveDelLink) {
      // Buscar la clave en el array de claves
      const claveEncontrada = this.claves.find(clave => clave.clave === claveDelLink);

      if (claveEncontrada) {
        // Si la clave está en la lista, extraemos el id_servicio
        const clave = claveEncontrada.clave;

        // Eliminar todos los caracteres no numéricos de la clave
        const idServicio = clave.replace(/\D/g, ''); // Reemplaza todos los caracteres no numéricos por una cadena vacía

        // Guardamos el id_servicio en una constante
        const idServicioConst = idServicio;
        
       

        // No cambiamos la ruta, solo usamos el id_servicio internamente
        this.idServicio = idServicioConst;

        // Realiza la carga de datos o lo que sea necesario con el idServicio
        this.cargarTrackingSteps(idServicioConst);
        this.cargarCotizaciones(idServicioConst);
      } else {
        // Si no se encuentra la clave, manejar el caso adecuadamente
        console.error('Clave no encontrada');
      }
    } else {
      // Si no hay clave en el enlace, manejar el caso adecuadamente
      console.error('No se proporcionó una clave en la URL');
    }
  },

  async cargarTrackingSteps(idServicio) {
    try {
      const response = await axios.get(`http://localhost:3000/api/pasos?id_servicio=${idServicio}`);
      this.trackingSteps = response.data;

      if (this.trackingSteps.length > 0) {
        this.estimatedTime = this.trackingSteps[0].estimatedTime;
      } else {
        this.estimatedTime = 'No disponible';
        Swal.fire({
          icon: 'info',
          title: 'Estado del Equipo',
          text: 'Tu equipo se encuentra aun en estado de inicio.',
          confirmButtonText: 'Volver',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.push('/');
          }
        });
      }
    } catch (error) {
      console.error('Error al cargar los pasos de servicio:', error);
    }
  },

    verCotizaciones() {
      $('#cotizacionesModal').modal('show');
  },
  cerrarCotizaciones(){
    $('#cotizacionesModal').modal('hide');
  },
  async cargarServicios() {
      try {
        const response = await axios.get('http://localhost:3000/api/servicios');
        this.servicios = response.data;
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
      }
    },

    async cargarCotizaciones(idServicio){
      try {
        const response = await axios.get(`http://localhost:3000/api/cotizacion_piezas/${idServicio}`);
        this.cotizaciones = response.data;
        console.log(this.cotizaciones);
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar las piezas.', 'error');
      }
    },

    buscar() {
  const claveEncontrada = this.claves.find(clave => clave.clave === this.numeroServicio.trim());

  if (claveEncontrada) {
    // Redirigir usando la clave completa en lugar del id_servicio
    this.router.push(`/tu_equipo?clave=${encodeURIComponent(claveEncontrada.clave)}`).then(() => {
      // Recargar la página después de la redirección
      window.location.reload();
    });
  } else {
    // Mostrar SweetAlert si no se encuentra la clave
    Swal.fire({
      icon: 'error',
      title: 'No encontrado',
      text: 'El equipo no fue encontrado.',
    });
  }
},


    async cargarTrackingSteps(idServicio) {
      try {
        const response = await axios.get(`http://localhost:3000/api/pasos?id_servicio=${idServicio}`);
        this.trackingSteps = response.data;

        if (this.trackingSteps.length > 0) {
          this.estimatedTime = this.trackingSteps[0].estimatedTime;
        } else {
          this.estimatedTime = 'No disponible';
          Swal.fire({
            icon: 'info',
            title: 'Estado del Equipo',
            text: 'Tu equipo se encuentra aun en estado de inicio.',
            confirmButtonText: 'Volver',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.push('/');
            }
          });
        }
      } catch (error) {
        console.error('Error al cargar los pasos de servicio:', error);
      }
    },
    openFullTrackingModal() {
      const modalElement = this.$refs.fullTrackingModal;
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    },
    closeFullTrackingModal() {
      const modalElement = this.$refs.fullTrackingModal;
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
  },
};
</script>


<style scoped>


@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}


@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.cancelada {
  color: #adb5bd48 !important;  /* Texto gris claro */
  text-decoration-line: line-through !important;  /* Tachar el texto */
}

.botones{
  display: flex;
  margin-top: 10px;
}

.confirm-quote-button {
  margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.confirm-quote-button:hover {
  background-color: #0b58ac;
  transform: scale(1.05);
}

.step-title {
  font-weight: bold; /* Título en negrita */
}

.step-details {
  margin-top: 5px; /* Espacio entre el título y los detalles */
}

.content-wrapper {
  display: flex;               
  justify-content: space-between; 
  width: 100%;                  
  margin-top: 20px;             
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .window {
    background-color: rgba(0, 0, 0, 0.575);
    width: 90vw;
    max-width: 1500px;
    height: 80vh;
    max-height: 1200px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 15px;
    box-shadow: 12px 13px 15px -4px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }


  .cabeza {
  width: 45%;
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  animation: slideIn 0.5s ease forwards;
}

/* Header section with logo */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}

.logo {
  width: 150px;
  height: auto;
}

h2 {
  color: #f8f9fa;
  margin-bottom: 20px;
  text-align: center;
}

.text {
  color: #ced4da;
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

/* Estilos para la barra de búsqueda */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.search-input {
  width: 250px;
  padding: 8px 12px;
  border: 2px solid #444;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 8px;
  background: #fff;
  color: #333;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 12px 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.search-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Estilos para el menú de seguimiento */
.tracking-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-right: 20px;
  width: 50%;
  padding: 25px;
  background-color: #292a2b;
  border-radius: 10px;
  box-shadow: 21px 17px 22px -4px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
  animation: slideIn 0.5s ease forwards;
}

.tracking-menu:hover{
  transform: scale(1.05);
}

.tracking-step {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.step-indicator {
  width: 16px; /* Tamaño uniforme para todos los indicadores */
  height: 16px;
  border-radius: 50%;
  background-color: gray; /* Color uniforme para todos los indicadores */
  margin-right: 10px;
}

.step-label {
  color: #ced4da; /* Color uniforme para todos los textos */
  font-size: 28px; /* Tamaño uniforme para todos los textos */
  font-weight: bold; /* Texto en negrita para todos */
  text-align: left; /* Justifica el texto a la izquierda */
}

/* Si quieres asegurarte de que todo el contenido en el tracking menu esté alineado a la izquierda */
.tracking-menu {
  text-align: left; /* Alinea todo el contenido dentro del tracking menu a la izquierda */
}

.step-label-container {
  display: flex;
  align-items: center;
  justify-content: center;
}


.current .step-indicator {
  background-color: transparent;
  border: 4px solid #007bff;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  width: 16px;
  height: 16px;
}

.step-label-container {
  display: flex;
  align-items: center;
}


.step-label {
  color: #ced4da;
  font-size: 18px;
}


.enter-button-container {
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  font-size: 24px;
}

.top-left-image {
    position: absolute;
    top: 10px;
    left: 20px;
    width: 200px; 
    height: auto;
  }


  .enter-button {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 7vw; 
    max-width: 50px;
    height: auto;
    font-size: 40px; 
    color: white;
    transition: transform 0.3s ease, filter 0.3s ease;
}
  
.enter-button:hover {
  transform: scale(1.1);
}

.menu-button {
  position: absolute;
  width: 7vw; 
  max-width: 50px;
  height: auto;
  font-size: 40px; 
  color: white;
  transition: transform 0.3s ease, filter 0.3s ease;
}
  
.menu-button:hover {
  transform: scale(1.1);
}



.estimated-time {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #343a40;
  color: #f8f9fa;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
}

.estimated-label {
  margin-right: 10px;
}

.estimated-value {
  color: #41BC91;
}

.modal-content {
  border: none; /* Eliminar el borde del modal */
}

.table th,
.table td {
  vertical-align: middle; /* Centrar verticalmente el texto en las celdas */
}

.modal-body {
  max-height: 400px; /* Establecer altura máxima para el contenido del modal */
  overflow-y: auto; /* Agregar desplazamiento vertical */
}

.table-dark {
  background-color: #343a40; /* Ajustar el color de fondo de la tabla */
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #292b2c; /* Color de filas alternas */
}


</style>
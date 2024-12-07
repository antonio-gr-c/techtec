<template>
  <menu-lateral />
  <div class="container">
    <div class="quote-container">
      <h1>Cotización del Equipo No. servicio  {{ idServicio }}</h1>
      <div v-if="equipo" class="quote-content">
        <!-- Cotización del Servicio -->
        <div class="service-quote">
          <h2>Cotización del Servicio</h2>
          <div class="form-group">
            <label for="precioServicio">Precio del Servicio:</label>
            <input type="number" v-model="precioServicio" id="precioServicio" />
          </div>
          <div class="form-group">
            <label for="descripcionServicio">Descripción del Servicio:</label>
            <textarea v-model="descripcionServicio" id="descripcionServicio" rows="3"></textarea>
          </div>
          <div class="button-group">
            <button @click="confirmarCotizacionServicio" class="confirm-quote-button">
              <span class="material-symbols-outlined">price_check</span>
            </button>
            <button @click="abrirModalCotizaciones" class="view-quotes-button">
              <span class="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>

        <!-- Agregar Nueva Pieza -->
        <div class="parts-quote">
          <h2>Agregar Nueva Pieza</h2>
          <div class="form-group">
            <label for="nombrePieza">Nombre de la Pieza:</label>
            <input type="text" v-model="nombrePieza" placeholder="Nombre de la pieza" />
          </div>
          
          <div class="form-group">
            <label for="costoPieza">Costo Estimado:</label>
            <input type="number" v-model="costoPieza" placeholder="Costo estimado" />
          </div>

          <label for="tiempoEntrega">tiempo de entrega estimado:</label>
            <input type="text" v-model="tiempoEntrega" placeholder="ejemplo: 2 a 3 dias" />

          <div class="button-group">
          <button @click="iniciarProcesoPieza" class="confirm-quote-button">
            <span class="material-symbols-outlined">add</span>
          </button>
          <button @click="abrirModalEstado" class="view-quotes-button">
            <span class="material-symbols-outlined">local_shipping</span>
          </button>
        </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar cotizaciones -->
<div class="modal fade" id="modalCotizaciones" tabindex="-1" role="dialog" aria-labelledby="cotizacionesLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content modal-dark">
      <div class="modal-header">
        <h5 class="modal-title" id="cotizacionesLabel">Cotizaciones del Servicio</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
          <table class="table table-dark table-striped">
            <thead class="thead-fixed">
              <tr>
                <th>#</th>
                <th>Descripción</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cotizacion, index) in cotizaciones" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ cotizacion.descripcion }}</td>
                <td>${{ cotizacion.precio }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>


    <!-- Modal para mostrar estado de piezas -->
    <div class="modal fade" id="modalEstadoPiezas" tabindex="-1" role="dialog" aria-labelledby="estadoPiezasLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content modal-dark">
      <div class="modal-header">
        <h5 class="modal-title" id="estadoPiezasLabel">Estado de Piezas</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
          <table class="table table-dark table-striped">
            <thead class="thead-fixed">
              <tr>
                <th>Pieza</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Observaciones</th>
                <th>Entrega</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pieza, index) in piezas" :key="index">
                <td>
                  <input v-if="pieza.editing" v-model="pieza.nombre" type="text" />
                  <span v-else>{{ pieza.nombre }}</span>
                </td>
                <td>
                  <input v-if="pieza.editing" v-model="pieza.costo" type="number" />
                  <span v-else>${{ pieza.costo }}</span>
                </td>
                <td>
                  <input v-if="pieza.editing" v-model="pieza.estado" type="text" />
                  <span v-else>{{ pieza.estado }}</span>
                </td>
                <td>
                  <input v-if="pieza.editing" v-model="pieza.observaciones" type="text" />
                  <span v-else>{{ pieza.observaciones }}</span>
                </td>
                <td>
                  <input v-if="pieza.editing" v-model="pieza.tiempo_entrega" type="text" />
                  <span v-else>{{ pieza.tiempo_entrega }}</span>
                </td>
                <td class="botonera">
                  <button @click="abrirModal(pieza)" class="view-quotes-button">
                    <span class="material-symbols-outlined" data-dismiss="modal">edit</span>
                  </button>
                  <button class="view-quotes-button">
                    <span 
                      class="material-symbols-outlined" 
                      data-dismiss="modal" 
                      @click="abrirModalCancel(pieza)"
                    >
                      cancel
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>


 <!-- Modal de Edición con Estilo Oscuro -->
<div class="modal fade" id="modalEditar" tabindex="-1" aria-labelledby="modalEditarLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content bg-dark text-light">
      <div class="modal-header border-secondary">
        <h5 class="modal-title" id="modalEditarLabel">Editar Pieza</h5>
        <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="nombrePieza" class="form-label">Nombre</label>
            <input type="text" class="form-control bg-secondary text-light border-0" id="nombrePieza" v-model="piezaSeleccionada.nombre" required>
          </div>
          <div class="mb-3">
            <label for="costoPieza" class="form-label">Costo</label>
            <input type="number" class="form-control bg-secondary text-light border-0" id="costoPieza" v-model="piezaSeleccionada.costo" required>
          </div>
          <div class="mb-3">
            <label for="estadoPieza" class="form-label">Estado</label>
            <select class="form-control bg-secondary text-light border-0" id="estadoPieza" v-model="piezaSeleccionada.estado" required>
              <option value="pieza solicitada">Pieza Solicitada</option>
              <option value="pieza en transito">Pieza en Tránsito</option>
              <option value="pieza llega al local">Pieza Llega al Local</option>
              <option value="daño de paquete">Daño de Paquete</option>
              <option value="daño de fábrica">Daño de Fábrica</option>
              <option value="pieza en buen estado">Pieza en Buen Estado</option>
              <option value="inicio de cambio de pieza">Inicio de Cambio de Pieza</option>
              <option value="proceso completado">Proceso Completado</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="observacionesPieza" class="form-label">Observaciones</label>
            <input type="text" class="form-control bg-secondary text-light border-0" id="observacionesPieza" v-model="piezaSeleccionada.observaciones" required>
          </div>
          <div class="mb-3">
            <label for="tiempoEntregaPieza" class="form-label">Tiempo de Entrega</label>
            <input type="text" class="form-control bg-secondary text-light border-0" id="tiempoEntregaPieza" v-model="piezaSeleccionada.tiempo_entrega" required>
          </div>
        </form>
      </div>
      <div class="modal-footer border-secondary">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="abrirModalEstado">Cerrar</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="guardarCambios">Guardar Cambios</button>
      </div>
    </div>
  </div>
</div>
<!-- Modal de cancelar con Estilo Oscuro -->
<div class="modal fade" id="modalCancelar" tabindex="-1" aria-labelledby="modalCancelar" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content bg-dark text-light">
      <div class="modal-header border-secondary">
        <h5 class="modal-title" id="modalEditarLabel">Editar Pieza</h5>
        <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="estadoPieza" class="form-label">Estado de cancelación</label>
            <select class="form-control bg-secondary text-light border-0" id="estadoPieza" v-model="piezaSeleccionada.estado" required>
  <option v-for="estado in opcionesCancelacion" :key="estado" :value="estado">
    {{ estado }}
  </option>
</select>
          </div>
        </form>
      </div>
      <div class="modal-footer border-secondary">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="abrirModalEstado">Cerrar</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="guardarCambiosCancel">Guardar Cambios</button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import MenuLateral from '@/components/menu.vue';

export default {
  
  
  components: { MenuLateral },
  data() {
    return {
      equipo: null,
      precioServicio: 0,
      descripcionServicio: '',
      piezas: [],
      nombrePieza: '',
      costoPieza: '',
      tiempoEntrega:'',
      cotizaciones: [],
      piezaSeleccionada: {},
      botonCancelado: false,
      opcionesCancelacion: [],
    };
  },

  mounted() {
  const params = new URL(window.location.href).searchParams;
  this.idServicio = params.get('id_servicio');

  // Verifica si se obtuvo correctamente el id_servicio
  console.log('ID de servicio desde URL:', this.idServicio);

  if (!this.idServicio) {
    console.log('Error: id_servicio no se encuentra en la URL');
  } else {
    this.cargarPiezas(this.idServicio);
    this.cargarCotizaciones(this.idServicio);
  }
},

  created() {
    this.updateEquipo();
  },
  methods: {
    updateEquipo() {
      this.equipo = this.getEquipo();
    },
    getEquipo() {
      return {
      };
    },
    async cargarPiezas(idServicio) {
      try {
        const response = await axios.get(`http://localhost:3000/api/cotizacion_piezas/${idServicio}`);
        this.piezas = response.data;
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar las piezas.', 'error');
      }
    },
    async cargarCotizaciones(idServicio) {
      try {
        const response = await axios.get(`http://localhost:3000/api/cotizacion_servicio/${idServicio}`);
        this.cotizaciones = response.data;
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar las cotizaciones.', 'error');
      }
    },

    abrirModal(pieza) {
      this.piezaSeleccionada = { ...pieza }; 
      const myModal = new bootstrap.Modal(document.getElementById('modalEditar'));
      myModal.show();
    },

    abrirModalCancel(pieza) {
  this.piezaSeleccionada = { ...pieza };

  // Abre el modal
  const myModal = new bootstrap.Modal(document.getElementById('modalCancelar'));
  myModal.show();

  // Cambia las opciones del select dependiendo del estado de cancelación
  if (this.botonCancelado) {
    // Cambia las opciones a las de cancelación
    this.opcionesCancelacion = [
      'pieza solicitada',
      'pieza en transito',
      'pieza llega al local',
      'daño de paquete',
      'daño de fábrica',
      'pieza en buen estado',
      'inicio de cambio de pieza',
      'proceso completado'
    ];
 
  } else {
    // Cambia las opciones a las de otros estados

    this.opcionesCancelacion = [
      'devolución de dinero', 
      'credito a favor', 
      'devolución de anticipo'
    ];
  }
},
    cerrarModal(){
             const myModal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
        myModal.hide();
    },
    
    async guardarCambios() {
  try {
    // Actualiza la pieza en la base de datos (usando el ID de la pieza)
    await axios.put(`http://localhost:3000/api/cotizacion_piezas/${this.piezaSeleccionada.idPieza}`, {
      nombre: this.piezaSeleccionada.nombre,
      costo: this.piezaSeleccionada.costo,
      estado: this.piezaSeleccionada.estado,
      observaciones: this.piezaSeleccionada.observaciones,
      tiempo_entrega: this.piezaSeleccionada.tiempo_entrega,
      estado_cancelacion: "no cancelado"
    });

    // Muestra un mensaje de éxito
    Swal.fire('Actualización Confirmada', 'Los cambios se han guardado correctamente.', 'success');

    // Recarga las piezas para actualizar la tabla principal
    await this.cargarPiezas(this.idServicio);  // Asegúrate de que `idServicio` esté definido en el componente
    await this.abrirModalEstado();
  } catch (error) {
    console.error("Error al actualizar la pieza:", error);
    Swal.fire('Error', 'No se pudo guardar la actualización.', 'error');
  }
},

async guardarCambiosCancel() {
  try {
    // Verifica el estado de cancelación y actualiza el estado de la pieza
    let nuevoEstadoCancelacion = this.botonCancelado ? "no cancelado" : "cancelado";
    await axios.put(`http://localhost:3000/api/cotizacion_piezas/${this.piezaSeleccionada.idPieza}`, {
      nombre: this.piezaSeleccionada.nombre,
      costo: this.piezaSeleccionada.costo,
      estado: this.piezaSeleccionada.estado,
      observaciones: this.piezaSeleccionada.observaciones,
      tiempo_entrega: this.piezaSeleccionada.tiempo_entrega,
      estado_cancelacion: nuevoEstadoCancelacion // Cambia a "no cancelado" o "cancelado"
    });

    // Actualiza el estado del botón
    this.botonCancelado = !this.botonCancelado;

    // Muestra un mensaje de éxito
    Swal.fire('Cancelación Confirmada', 'El estado de cancelación se ha actualizado correctamente.', 'success');

    // Recarga la lista de piezas para reflejar los cambios
    await this.cargarPiezas(this.idServicio);

  } catch (error) {
    console.error("Error al actualizar el estado de cancelación:", error);
    Swal.fire('Error', 'No se pudo actualizar el estado de cancelación.', 'error');
  }
},
    async confirmarCotizacionServicio() {
      if (!this.descripcionServicio || this.precioServicio <= 0) {
        Swal.fire('Error', 'Ingrese una descripción y precio válidos.', 'error');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/cotizacion_servicio', {
          descripcion: this.descripcionServicio,
          precio: this.precioServicio,
          id_servicio: this.$route.query.id_servicio
        });

        const nuevaCotizacion = {
          id_cotizacion: response.data.id_cotizacion,
          descripcion: this.descripcionServicio,
          precio: this.precioServicio,
        };
        this.cotizaciones.push(nuevaCotizacion);
        Swal.fire('Cotización Confirmada', 'Se ha registrado una nueva cotización.', 'success');
        this.precioServicio = '';
        this.descripcionServicio = '';
        this.tiempoEntrega = '';
      } catch (error) {
        Swal.fire('Error', 'No se pudo registrar la cotización.', 'error');
      }
    },

    abrirModalCotizaciones() {
      const modal = new bootstrap.Modal(document.getElementById('modalCotizaciones'));
      modal.show();
    },
    abrirModalEstado() {
      const modal = new bootstrap.Modal(document.getElementById('modalEstadoPiezas'));
      modal.show();
    },
    goBack() {
      this.$router.push({ name: 'servicio' });
    },

    // Método para iniciar el proceso de agregar nueva pieza
    iniciarProcesoPieza() {
  // Verificar que idServicio tenga un valor antes de continuar
  if (!this.idServicio) {
    Swal.fire('Error', 'El ID de servicio no está definido', 'error');
    return;
  }

  // Datos de la nueva pieza, incluyendo idServicio
  const nuevaPieza = {
    nombre: this.nombrePieza,
    costo: this.costoPieza,
    tiempo_entrega: this.tiempoEntrega,
    id_servicio: this.idServicio // Agregar idServicio al objeto
  };

  // Validar los datos antes de enviar
  if (!nuevaPieza.nombre || !nuevaPieza.costo || !nuevaPieza.tiempo_entrega) {
    Swal.fire('Error', 'Por favor completa todos los campos', 'error');
    return;
  }

  // Llamada al endpoint para agregar la nueva pieza
  axios.post('http://localhost:3000/api/cotizacion_piezas', nuevaPieza)
    .then(response => {
      // Manejo de la respuesta
      Swal.fire('Éxito', 'Pieza agregada correctamente', 'success');
      this.cargarPiezas(this.idServicio);  // Recargar las piezas si es necesario
    })
    .catch(error => {
      // Manejo de errores
      Swal.fire('Error', 'Hubo un problema al agregar la pieza', 'error');
      console.error(error);
    });
},


  },
};
</script>





<style scoped>

/* Ajuste de estilo para el encabezado fijo */
.thead-fixed th {
  position: sticky;
  top: 0;
  background-color: #16181b; /* Asegura que el fondo sea sólido */
  z-index: 10; /* Eleva el encabezado sobre otras filas */
}


/* Estilos generales */
.quote-container {
  background-color: #292a2b;
  padding: 40px 20px 20px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  color: white;
  margin-top: 0;
  box-shadow: 14px 5px 20px 0px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.5s ease forwards;
}

.container {
  padding: 40px 20px 60px 30px;
  max-width: 750px;
  margin: 0 auto;
  position: relative;
  top: 0px;
  left: 7%;
}

.form-group2{
  display: flex;
}

.botonera{
  display: flex;
}

.quote-container h1,
.quote-container h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

/* Estilos para la sección de cotización de servicios */
.service-quote,
.parts-quote {
  margin-top: 40px;
  margin-bottom: 30px;
  background-color: #3b3b3b;
  padding: 20px;
  border-radius: 10px;
}

.service-quote input,
.parts-quote input {
  width: 100%;
  padding: 8px;
  background-color: #444;
  color: #f1f1f1;
  border: none;
  border-radius: 5px;
}

.service-quote textarea {
  width: 100%;
  padding: 10px;
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 5px;
  resize: none;
}

/* Estilos para las piezas */
.pieza-item {
  margin-bottom: 15px;
}

/* Botones */

.add-part-button {
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}



.confirm-quote-button {
  margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #21aa28;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.view-quotes-button {
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

.view-quotes-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.confirm-quote-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.add-part-button {
  background-color: #007bff;
  color: white;
}

.add-part-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.back-button {
  background-color: #6c757d;
  color: white;
}

.back-button:hover {
  background-color: #5a6268;
  transform: scale(1.05);
}

.pieza-estado.bien {
  color: green;
}

.pieza-estado.defecto,
.pieza-estado.daño {
  color: red;
}

.button-group {
  display: flex;
  justify-content:center;
  margin-top: 10px;
}



.modal-dark {
  background-color: #343a40; /* Fondo oscuro del modal */
  color: #f8f9fa; /* Texto claro */
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
}

.modal-header {
  border-bottom: 1px solid #495057;
}

.modal-footer {
  border-top: 1px solid #495057;
}

.table-dark th,
.table-dark td {
  border-color: #495057; /* Bordes de la tabla */
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #3b3b3b; /* Color de las filas impares */
}

.close span {
  color: #f8f9fa;
  font-size: 24px;
  opacity: 0.75;
  transition: opacity 0.3s;
}

.close span:hover {
  opacity: 1;
}

.modal-body {
  max-height: 400px; /* Ajusta la altura máxima según sea necesario */
  overflow-y: auto; /* Habilita el desplazamiento vertical si el contenido excede la altura */
}

.cabecera-modal{
  color: #0056b3;
}

</style>
<template>
  <menu-lateral />
  <div class="details-container">
    <div class="container">
      <h1>Detalles del Equipo</h1>
      <div v-if="equipo" class="details-content">
        <div class="detail-list">
          <div class="detail-item" v-for="(value, key) in equipo" :key="key">
            <span class="label">{{ typeof value === 'string' ? key.charAt(0).toUpperCase() + key.slice(1) : key }}:</span>
            <span class="value">{{ value }}</span>
          </div>
        </div>

        <div class="detail-item">
          <span class="label">Descripción del problema:</span>
          <textarea v-model="descripcionProblema" disabled rows="3"></textarea>
        </div>

        <div class="maintenance-section">
          <h2>Pasos del Servicio</h2>
          <div class="add-step">
            <input v-model="nuevoPaso.nombre" placeholder="Nombre del paso" />
            <input v-model="nuevoPaso.descripcionGeneral" placeholder="Descripción general" />
            <div class="button-group">
              <button @click="agregarPaso" class="add-button">
                <span class="material-symbols-outlined">save</span>
              </button>
            </div>
          </div>

          <table class="maintenance-table">
  <thead>
    <tr>
      <th>Nombre del Paso</th>
      <th>Descripción General</th>
      <th>Realizado por</th> <!-- Nuevo campo -->
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(paso, index) in mantenimientoPasos" :key="index">
      <td>{{ paso.nombre_paso }}</td>
      <td>{{ paso.descripcion_general }}</td>
      <td>{{ paso.nombre_trabajador }}</td> <!-- Muestra el nombre del trabajador -->
      <td>
        <div class="button-group">
          <button @click="toggleCompletado(paso)" class="confirm-quote-button">
            <span class="material-symbols-outlined">{{ paso.completado ? 'unpublished' : 'check_circle' }}</span>
          </button>
          <button @click="editarPaso(paso)" class="confirm-quote-button">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button @click="eliminarPaso(index)" class="confirm-quote-button">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</table>

        </div>

        <div class="button-group">
  <button @click="mostrarFormularioAgregarPaso" class="confirm-quote-button">
    <span class="material-symbols-outlined">add</span>
    Agregar Paso
  </button>
  <button @click="abrirModalPasos" class="confirm-quote-button">
    <span class="material-symbols-outlined">visibility</span>
    Ver Pasos
  </button>
</div>




        <div class="quoted-parts-section">
          <h2>Piezas Cotizadas</h2>
          <table class="quoted-parts-table">
            <thead>
              <tr>
                <th>Nombre de la Pieza</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pieza in piezasCotizadas" :key="pieza.idPieza">
                <td>{{ pieza.nombre }}</td>
                <td>{{ pieza.costo }}</td>
                <td>{{ pieza.estado }}</td>
                <td>{{ pieza.observaciones }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="button-group">
          <button @click="irCotizacion" class="confirm-quote-button">
            <span class="material-symbols-outlined">request_quote</span>
          </button>
          <button @click="goBack" class="confirm-quote-button">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
<!-- Modal para mostrar los pasos -->
<div
  class="modal fade"
  id="modalPasos"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modalPasosLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalPasosLabel">Pasos del Servicio</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="cerrarModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Paso</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paso in pasosVisualizados" :key="paso.id_paso_cliente">
              <td>{{ paso.paso }}</td>
              <td>{{ paso.descripcion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
      </div>
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
import MenuLateral from '@/components/menu.vue';

export default {
  
  components: {
    MenuLateral,
  },
  data() {
  return {
    equipo: null,
    descripcionProblema: '',
    mantenimientoPasos: [],
    pasosVisualizados: [],
    nuevoPaso: {
      nombre: '',
      descripcionGeneral: '',
    },
    piezasCotizadas: [],
    idServicio: null,
    trabajadorNombres: [],
    id_trabajador:'',
    
  };
},
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const equipoId = urlParams.get('id_equipo');
    const userId = localStorage.getItem('userId');

if(userId){
  this.fetchTrabajador(userId);
  this.id_trabajador = userId;
}

    if (equipoId) {
      await this.updateEquipo(equipoId);
      await this.cargarPasosServicio();
      await this.cargarPiezasCotizadas(); 
    }
  },

  methods: { 
    async abrirModalPasos() {
    try {
      const response = await axios.get(`http://localhost:3000/api/pasos_cliente/${this.idServicio}`);
      if (response.status === 200) {
        this.pasosVisualizados = response.data; // Guarda los pasos obtenidos
        this.abrirModal(); // Llama a la función para abrir el modal
      }
    } catch (error) {
      console.error('Error al obtener los pasos del servicio:', error);
      Swal.fire('Error', 'No se pudieron cargar los pasos.', 'error');
    }
  },

  abrirModal() {
    $('#modalPasos').modal('show'); // Abre el modal con Bootstrap
  },

  cerrarModal() {
    $('#modalPasos').modal('hide'); // Cierra el modal con Bootstrap
  },



    async fetchTrabajador(userId) {  // Recibe userId como parámetro
      try {
        // Llama al endpoint con el userId proporcionado
        const response = await axios.get(`http://localhost:3000/api/trabajadores/${userId}`);
        
        // Extrae el nombre completo y guárdalo en el array
        const nombreCompleto = `${response.data.nombre} ${response.data.apellido_paterno} ${response.data.apellido_materno}`;
        this.trabajadorNombres.push(nombreCompleto);
        
        // Imprime el array en la consola
        console.log(this.trabajadorNombres);
      } catch (error) {
        console.error("Error fetching trabajador:", error);
      }
    },

    async updateEquipo(id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/detalles/${id}`);
        if (response.status === 200) {
          const data = response.data;
          this.equipo = data;
          this.descripcionProblema = data.descripcion_problema;
          this.idServicio = data.id_servicio;
        }
      } catch (error) {
        Swal.fire('Error', 'Error al obtener el equipo.', 'error');
      }
    },
    async cargarPasosServicio() {
      try {
        const response = await axios.get(`http://localhost:3000/api/pasos/${this.idServicio}`);
        if (response.status === 200) {
          this.mantenimientoPasos = response.data.map(paso => ({ ...paso, editando: false }));
        }
      } catch (error) {
        Swal.fire('Error', 'Error al cargar los pasos del servicio.', 'error');
      }
    },
    async cargarPiezasCotizadas() {
  try {
    const response = await axios.get(`http://localhost:3000/api/cotizacion_piezas/${this.idServicio}`);
    if (response.status === 200) {
      this.piezasCotizadas = response.data;
    }
  } catch (error) {
    console.error('Error al cargar las piezas cotizadas:', error);
    Swal.fire('Error', 'No se encontraron piezas cotizadas.', 'error');
  }
},
async agregarPaso() {
    if (this.nuevoPaso.nombre && this.nuevoPaso.descripcionGeneral) {
      try {
        const response = await axios.post('http://localhost:3000/api/pasos', {
          id_servicio: this.idServicio,
          nombre_paso: this.nuevoPaso.nombre,
          descripcion_general: this.nuevoPaso.descripcionGeneral,
          completado: 0,
          id_trabajador: this.id_trabajador,  // ID del trabajador responsable
          nombre_trabajador: this.trabajadorNombres,  // Nombre del trabajador
        });
        if (response.status === 201) {
          this.nuevoPaso = { nombre: '', descripcionGeneral: '' };
          Swal.fire('Éxito', 'Paso agregado correctamente.', 'success').then(() => {
            this.cargarPasosServicio();
          });
        }
      } catch (error) {
        Swal.fire('Error', 'Error al agregar el paso.', 'error');
      }
    } else {
      Swal.fire('Advertencia', 'Completa todos los campos para agregar un paso.', 'warning');
    }
  },
    async editarPaso(paso) {
      const { value: formValues } = await Swal.fire({
        title: 'Editar Paso',
        html: `
          <input id="nombrePaso" class="swal2-input" placeholder="Nombre del paso" value="${paso.nombre_paso}">
          <input id="descripcionPaso" class="swal2-input" placeholder="Descripción general" value="${paso.descripcion_general}">
        `,
        focusConfirm: false,
        preConfirm: () => {
          const nombre = document.getElementById('nombrePaso').value;
          const descripcion = document.getElementById('descripcionPaso').value;
          return { nombre, descripcion };
        },
      });

      if (formValues) {
        paso.nombre_paso = formValues.nombre;
        paso.descripcion_general = formValues.descripcion;
        await this.actualizarPaso(paso);
      }
    },
    async actualizarPaso(paso) {
  try {
    const response = await axios.put(`http://localhost:3000/api/pasos/${paso.id_paso}`, {
      nombre_paso: paso.nombre_paso,
      descripcion_general: paso.descripcion_general,
      completado: paso.completado,
      id_trabajador: this.id_trabajador,
      nombre_trabajador: this.trabajador,
    });
    if (response.status === 200) {
      Swal.fire('Éxito', 'Paso actualizado y registrado en el historial correctamente.', 'success');
      this.cargarPasosServicio();
    }
  } catch (error) {
    Swal.fire('Error', 'Error al registrar el cambio del paso.', 'error');
  }
},
    async toggleCompletado(paso) {
      paso.completado = !paso.completado; // Cambiar el estado de completado
      await this.actualizarPaso(paso); // Actualizar en la base de datos
    },
    async eliminarPaso(index) {
  const paso = this.mantenimientoPasos[index];
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás deshacer esta acción',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/pasos/${paso.id_paso}`, {
          data: { trabajador: this.trabajador } // Agrega el nombre del trabajador en la solicitud DELETE
        });
        if (response.status === 200) {
          this.mantenimientoPasos.splice(index, 1);
          Swal.fire('Eliminado', 'El paso ha sido eliminado.', 'success');
        }
      } catch (error) {
        Swal.fire('Error', 'Error al eliminar el paso.', 'error');
      }
    }
  });
},

async mostrarFormularioAgregarPaso() {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar Paso del Servicio',
      html: `
        <input id="nuevoPasoNombre" class="swal2-input" placeholder="Nombre del paso">
        <textarea id="nuevoPasoDescripcion" class="swal2-textarea" placeholder="Descripción del paso"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById('nuevoPasoNombre').value;
        const descripcion = document.getElementById('nuevoPasoDescripcion').value;
        return { nombre, descripcion };
      },
    });

    if (formValues) {
      const { nombre, descripcion } = formValues;

      // Validar que se llenen ambos campos
      if (!nombre || !descripcion) {
        Swal.fire('Advertencia', 'Todos los campos son obligatorios.', 'warning');
        return;
      }

      try {
        // Llamada al endpoint para agregar el paso
        const response = await axios.post(`http://localhost:3000/api/pasos_cliente/${this.idServicio}`, {
          paso: nombre,
          descripcion,
        });

        if (response.status === 201) {
          Swal.fire('Éxito', 'Paso agregado correctamente.', 'success').then(() => {
            this.cargarPasosServicio(); // Recargar los pasos del servicio
          });
        }
      } catch (error) {
        Swal.fire('Error', 'Error al agregar el paso.', 'error');
      }
    }
  },
    goBack() {
      this.$router.go(-1);
    },
    irCotizacion() {
      this.$router.push({ name: 'cotizacion', query: { id_servicio: this.idServicio } });
    },
  },
};
</script>


<style scoped>
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

.container {
  margin-top: 10px;
  background-color: #1a1a1a;
  color: white;
  padding: 40px 20px 20px;
  max-width: 750px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 18px 10px 15px -3px rgba(0, 0, 0, 0.4);
}

.details-container {
  padding: 40px 20px 100px;
  max-width: 750px;
  margin: 0 auto;
  position: relative;
  top: 0px;
  left: 7%;
  animation: slideIn 0.5s ease forwards;
}

.details-container h1,
.details-container h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
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

.service-steps {
  margin-top: 40px;
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 10px;
}

.service-steps h2 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #e0e0e0;
  text-align: center;
}

.service-steps input[type="text"],
.service-steps textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  background-color: #1a1a1a;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 5px;
}

.service-steps button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #ffc107;
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}



.service-steps ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.service-steps li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2a2a2a;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.service-steps input[type="checkbox"] {
  margin-right: 10px;
}

.service-steps .completed {
  text-decoration: line-through;
  color: #808080;
}


/* Estilos nuevos para pasos de mantenimiento */
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
  background-color: #3a3a3a;
  padding: 10px;
  border-radius: 5px;
}
.add-step input,
.add-step textarea {
  width: 100%;
  margin: 5px 0;
  padding: 8px;
  background-color: #3a3a3a;
  color: #e0e0e0;
  border: 1px solid #555;
  border-radius: 5px;
}
.add-button {
  margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
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
.add-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

/* Botones de acción en cada paso */
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
  background-color: #07509e;
  transform: scale(1.05);
}

.button-group {
  display: flex;
  justify-content:center;
  margin-top: 10px;
}

/* Estilos para el estado de edición */
.editing {
  background-color: #4a4a4a;
  border: 2px dashed #5d9cec;
  padding: 15px;
}
.editing input,
.editing textarea {
  background-color: #5d5d5d;
  color: #e0e0e0;
  border: 1px solid #777;
  padding: 8px;
  border-radius: 5px;
  width: 100%;
  margin-top: 5px;
}

/* Nuevos estilos para la tabla */
.maintenance-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.maintenance-table th, .maintenance-table td {
  padding: 10px;
  border: 1px solid #444;
  text-align: left;
  background-color: #2a2a2a;
  color: #e0e0e0;
}

.maintenance-table th {
  background-color: #3a3a3a;
}

.completed {
  text-decoration: line-through;
  color: #808080;
}

/* Estilos refinados para la sección de piezas cotizadas */
.quoted-parts-section {
  margin-top: 30px;
}

.quoted-parts-section h2 {
  font-size: 1.8em;
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 15px;
  text-align: center;
}

/* Estilos para la tabla de piezas cotizadas */
.quoted-parts-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #2a2a2a;
  margin-top: 20px;
  border-radius: 20px;
}

.quoted-parts-table th, .quoted-parts-table td {
  padding: 12px;
  border: 1px solid #444;
  text-align: left;
  background-color: #2a2a2a;
  color: #f0f0f0;
}

.quoted-parts-table th {
  background-color: #3a3a3a;
}

.quoted-parts-table tr:nth-child(even) {
  background-color: #333;
}

.quoted-parts-table tr:hover {
  background-color: #3f3f3f;
  transition: background-color 0.3s ease;
}

/* Estilos para los estados de las piezas */
.pieza-completada {
  text-decoration: line-through;
  color: #7c7c7c;
}

.pieza-en-buen-estado {
  color: #1fce6d; /* Verde para piezas en buen estado */
  font-weight: bold;
}

.pieza-en-transito {
  color: #f0a500; /* Amarillo para piezas en tránsito */
  font-style: italic;
}

.pieza-solicitada {
  color: #ff6b6b; /* Rojo para piezas solicitadas */
  font-weight: bold;
}


</style>
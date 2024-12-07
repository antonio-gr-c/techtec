<template>
  <menu-lateral />
  <div class="form-container">
    <form @submit.prevent="submitForm" class="form">
      <h3>Registro de nuevo equipo</h3>

      <!-- Apartado 1: Datos del Cliente -->
      <input v-model="cliente.nombre" placeholder="Nombre" type="text" id="nombre" required>

      <label for="apellido_paterno"></label>
      <input v-model="cliente.apellidoPaterno" placeholder="Apellido paterno" type="text" id="apellido_paterno" required>

      <label for="apellido_materno"></label>
      <input v-model="cliente.apellidoMaterno" placeholder="Apellido Materno" type="text" id="apellido_materno" required>

      <label for="domicilio"></label>
      <input v-model="cliente.domicilio" placeholder="Domicilio" type="text" id="domicilio" required>

      <label for="email"></label>
      <input v-model="cliente.email" placeholder="Email" type="email" id="email" required>

      
      <label for="celular"></label>
  <div v-for="(celular, index) in cliente.celulares" :key="index" class="cell-container">
    <!-- Select para la lada -->
    
    <select v-model="celular.lada" :id="'lada' + index" required class="options-container">
      <option v-for="(lada, idx) in ladas" :key="idx" :value="lada.lada">
        +{{ lada.lada }} {{ lada.pais }} {{ lada.emoji }}
      </option>
    </select>
    
    <!-- Input para el número de celular -->
    <input v-model="celular.numero" type="text" :id="'celular' + index" placeholder="Celular" required>
    
    <!-- Botón para agregar más campos -->
    <button type="button" @click="addCelular">
      <span class="material-symbols-outlined add-icon">add_circle</span>
    </button>
  </div>

      <!-- Apartado 2: Equipo -->
      <div class="inline-container">
        <label for="tipo_equipo"></label>
        <div class="options-container">
          <select v-model="equipo.idTipoEquipo" id="tipo_equipo" @change="fetchTiposServicio">
            <option v-for="tipo in tiposEquipo" :key="tipo.id_tipo_equipo" :value="tipo.id_tipo_equipo">{{ tipo.equipo }}</option>
            <option value="">Tipo de equipo</option>
          </select>
          <button type="button" @click="addTipoEquipo">
            <span class="material-symbols-outlined add-icon">add_circle</span>
          </button>
        </div>

        <label for="agregados"></label>
        <div class="options-container">
          <select v-model="equipo.idAgregados" id="agregados">
            <option v-for="agregado in agregados" :key="agregado.id_agregados" :value="agregado.id_agregados">{{ agregado.tipo_agregado }}</option>
            <option value="">Agregados</option>
          </select>
          <button type="button" @click="addAgregado">
            <span class="material-symbols-outlined add-icon">add_circle</span>
          </button>
        </div>

        <label for="tipo_servicio"></label>
        <div class="options-container">
          <select v-model="equipo.idTipoServicio" id="tipo_servicio">
            <option v-for="tipo in tiposServicio" :key="tipo.id_tipo_servicio" :value="tipo.id_tipo_servicio">{{ tipo.servicio }}</option>
            <option value="">Tipo de Servicio</option>
          </select>
          <button type="button" @click="addTipoServicio">
            <span class="material-symbols-outlined add-icon">add_circle</span>
          </button>
        </div>
      </div>

      <label for="descripcion_agregado"></label>
      <input v-model="equipo.descripcionAgregado" placeholder="Descripción del Agregado" type="text" id="descripcion_agregado" />

      <div class="inline-container">
        <label for="marca"></label>
        <div class="equip-container">
          <input v-model="equipo.marca" placeholder="Marca" type="text" id="marca" required>
        </div>

        <label for="serie"></label>
        <div class="equip-container">
          <input v-model="equipo.serie" placeholder="Serie" type="text" id="serie" required>
        </div>

        <label for="modelo"></label>
        <div class="equip-container">
          <input v-model="equipo.modelo" placeholder="Modelo" type="text" id="modelo" required>
        </div>

        <label>Estado:</label>
        <div class="radio-group">
          <input type="radio" id="bueno" value="BUENO" v-model="equipo.estado" class="status-input" />
          <label for="bueno" class="status-label green"></label>

          <input type="radio" id="regular" value="REGULAR" v-model="equipo.estado" class="status-input" />
          <label for="regular" class="status-label yellow"></label>

          <input type="radio" id="malo" value="MALO" v-model="equipo.estado" class="status-input" />
          <label for="malo" class="status-label red"></label>
        </div>
      </div>

      <label for="descripcion_equipo"></label>
      <input v-model="equipo.descripcion" placeholder="Descripción del Equipo" type="text" id="descripcion_equipo" required>

      <label for="observaciones"></label>
      <textarea v-model="equipo.observaciones" placeholder="Observaciones:" id="observaciones"></textarea>

      <label for="tiempo_entrega"></label>
      <div class="time-container">
        <div class="options-container">
        <select v-model="equipo.prioridad" id="prioridad" class="urgencia" required>
          <option value="No urgente">No urgente</option>
  <option value="Medianamente urgente">Medianamente urgente</option>
  <option value="Urgente">Urgente</option>

        </select>
      </div>
        <input v-model.number="equipo.costo" placeholder="Costo" type="number" id="costo" required>
        <input v-model.number="equipo.tiempoEntrega" placeholder="Tiempo de Entrega" type="number" id="tiempo_entrega" required>

        <!-- Menú desplegable para la prioridad -->
        
        <input type="radio" id="dias" value="DIAS" v-model="equipo.medidaTiempo" />
        <label for="dias" class="option-label">Días</label>

        <input type="radio" id="horas" value="HORAS" v-model="equipo.medidaTiempo" />
        <label for="horas" class="option-label">Hrs</label>
      </div>

      <div>
        <button type="submit" class="action-button">
          <span class="material-symbols-outlined submit-icon">send</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import MenuLateral from '@/components/menu.vue';

export default {
  components: {
    MenuLateral, // Registrar el componente
  },
  data() {
    return {
      cliente: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        domicilio: '',
        email: '',
        celulares: [
          {
            lada: '',
            numero: ''
          }
        ]
      },
      equipo: {
        idTipoEquipo: '',
        estado: '',
        idTipoServicio: '',
        idAgregados: '',
        descripcionAgregado: '',
        marca: '',
        serie: '',
        modelo: '',
        descripcion: '',
        observaciones: '',
        tiempoEntrega: null,
        medidaTiempo: '',
        costo: null,
        prioridad: "No urgente",
      },
      tiposEquipo: [],
      tiposServicio: [],
      agregados: [],
      ladas : [
  { pais: 'México', emoji: '🇲🇽', lada: '52' },
  { pais: 'Estados Unidos', emoji: '🇺🇸', lada: '1' },
  { pais: 'Canadá', emoji: '🇨🇦', lada: '1' },
  { pais: 'España', emoji: '🇪🇸', lada: '34' },
  { pais: 'Argentina', emoji: '🇦🇷', lada: '54' },
  { pais: 'Colombia', emoji: '🇨🇴', lada: '57' },
  { pais: 'Brasil', emoji: '🇧🇷', lada: '55' },
  { pais: 'Chile', emoji: '🇨🇱', lada: '56' },
  { pais: 'Perú', emoji: '🇵🇪', lada: '51' },
  { pais: 'Venezuela', emoji: '🇻🇪', lada: '58' },
  { pais: 'Reino Unido', emoji: '🇬🇧', lada: '44' },
  { pais: 'Francia', emoji: '🇫🇷', lada: '33' },
  { pais: 'Italia', emoji: '🇮🇹', lada: '39' },
],
    };
  },
  mounted() {
    this.fetchTiposEquipo();
    this.fetchTiposServicio();
    this.fetchAgregados();
  },
  methods: {
    regresar() {
      router.push('/trabajadores');
    },

    addCelular() {
      this.cliente.celulares.push({
        lada: '',
        numero: ''
      });
    },

    async submitForm() {
  // Validaciones previas al envío
  const nombreRegex = /^[A-Za-z]+$/;
  const celularRegex = /^[0-9]{10}$/;
  const tiempoEntregaRegex = /^[0-9]{1,2}$/;

  if (!nombreRegex.test(this.cliente.nombre)) {
    Swal.fire({
      title: 'Error!',
      text: 'El nombre solo puede contener letras.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  for (const celular of this.cliente.celulares) {
    if (!celular.lada || !celular.numero || !celularRegex.test(celular.numero)) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe ingresar tanto la lada como un número de celular válido (10 dígitos).',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
  }

  const tiempoEntrega = this.equipo.tiempoEntrega;
  if (!tiempoEntregaRegex.test(tiempoEntrega)) {
    Swal.fire({
      title: 'Error!',
      text: 'El tiempo de entrega debe ser un número de 1 o 2 dígitos.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    Swal.fire({
      title: 'Error!',
      text: 'No se ha encontrado el ID del usuario.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  // Crear el objeto de datos
  const formData = {
    cliente: { ...this.cliente },
    celular: {
      celulares: this.cliente.celulares.map(celular => ({
        lada: celular.lada,
        numero: celular.numero,
      })),
    },
    equipo: { ...this.equipo },
    servicio: {
      observaciones: this.equipo.observaciones,
      tiempo_entrega: this.equipo.tiempoEntrega,
      medida_tiempo: this.equipo.medidaTiempo,
      id_tipo_servicio: this.equipo.idTipoServicio,
      id_trabajador: Number(userId),
      costo: this.equipo.costo,
      prioridad: this.equipo.prioridad,
    },
  };

  try {
    // Confirmar si desea agregar una nota
    const { isConfirmed } = await Swal.fire({
      title: '¿Deseas agregar una nota para el servicio?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });

    let etiqueta = '';

    if (isConfirmed) {
      const { value } = await Swal.fire({
        title: 'Agregar nota para el servicio',
        input: 'textarea',
        inputPlaceholder: 'Escribe la nota aquí...',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      });

      if (value) {
        etiqueta = value.trim();
      }
    }

    // Enviar el formulario principal
    const response = await axios.post('http://localhost:3000/submitForm', formData);

    if (response.data.success) {
      const idServicio = response.data.id_servicio;

      // Si hay una etiqueta, agregarla al servicio
      if (etiqueta) {
        await axios.post(`http://localhost:3000/api/etiquetas/${idServicio}`, { etiqueta });
        Swal.fire({
          title: 'Nota agregada',
          text: 'La nota se ha guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      }

      // Mostrar éxito y redirigir
      this.$router.push({ name: 'hoja_servicio_print', params: { idServicio } });
      Swal.fire({
        title: 'Éxito!',
        text: `El formulario se ha enviado correctamente. ID Servicio: ${idServicio}`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      // Limpiar el formulario
      this.resetForm();
    }
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'Hubo un problema al enviar el formulario. Intenta nuevamente.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
},



    resetForm() {
      // Reinicia los datos del formulario a sus valores iniciales
      this.cliente = {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        domicilio: '',
        email: '',
        celulares: [''],
      };
      
      this.equipo = {
        idTipoEquipo: '',
        estado: '',
        idTipoServicio: '',
        idAgregados: '',
        descripcionAgregado: '',
        marca: '',
        serie: '',
        modelo: '',
        descripcion: '',
        observaciones: '',
        tiempoEntrega: null,
        medidaTiempo: '',
        costo: null,
        prioridad: "No urgente",
      };
    },

    async fetchTiposEquipo() {
      const response = await axios.get('http://localhost:3000/api/tipos_equipo');
      this.tiposEquipo = response.data;
    },
    async fetchTiposServicio() {
      const response = await axios.get('http://localhost:3000/api/tipos_servicio');
      this.tiposServicio = response.data;
    },
    async fetchAgregados() {
      const response = await axios.get('http://localhost:3000/api/agregados');
      this.agregados = response.data;
    },

    async addTipoEquipo() {
      const { value: nuevoTipo } = await Swal.fire({
        title: 'Agregar nuevo tipo de equipo',
        input: 'text',
        inputLabel: 'Nombre del nuevo tipo de equipo',
        inputPlaceholder: 'Ingrese el tipo de equipo',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Por favor ingrese un nombre!';
          }
        },
      });

      if (nuevoTipo) {
        const response = await axios.post('http://localhost:3000/api/tipos_equipo', { equipo: nuevoTipo });
        this.equipo.idTipoEquipo = response.data.id_tipo_equipo; // Seleccionar el nuevo tipo
        this.fetchTiposEquipo(); // Refrescar lista
      }
    },

    async addTipoServicio() {
      const { value: nuevoServicio } = await Swal.fire({
        title: 'Agregar nuevo tipo de servicio',
        input: 'text',
        inputLabel: 'Nombre del nuevo tipo de servicio',
        inputPlaceholder: 'Ingrese el tipo de servicio',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Por favor ingrese un nombre!';
          }
        },
      });

      if (nuevoServicio) {
        const response = await axios.post('http://localhost:3000/api/tipos_servicio', { servicio: nuevoServicio });
        this.equipo.idTipoServicio = response.data.id_tipo_servicio; // Seleccionar el nuevo servicio

        this.fetchTiposServicio(); // Refrescar lista
      }
    },

    async addAgregado() {
      const { value: nuevoAgregado } = await Swal.fire({
        title: 'Agregar nuevo agregado',
        input: 'text',
        inputLabel: 'Nombre del nuevo agregado',
        inputPlaceholder: 'Ingrese el tipo de agregado',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Por favor ingrese un nombre!';
          }
        },
      });

      if (nuevoAgregado) {
        const response = await axios.post('http://localhost:3000/api/agregados', { tipoAgregado: nuevoAgregado });
        this.equipo.idAgregados = response.data.id_agregado; // Seleccionar el nuevo agregado
        this.fetchAgregados(); // Refrescar lista
      }
    },
  }
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


.form-container {
  padding: 40px 20px 20px; 
  max-width: 750px;
  margin: 0 auto; 
  position: relative; 
  top: 0px;
  left: 7%;
  animation: slideIn 0.5s ease forwards;
}


.form {
  background-color: #292a2b;
  padding: 40px 20px 20px; 
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  color: white; 
  margin-top: 0; 
  box-shadow: 14px 5px 20px 0px rgba(0,0,0,0.4);
}




label {
  margin-top: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="number"],
textarea,
select {
  margin-top: 5px;
  margin-bottom: 15px; 
  padding: 8px;
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent;
  color: white;
  outline: none;
  width: 100%;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus,
select:focus {
  border-bottom-color: #065d7d; 
}

textarea {
  height: 100px;
  resize: none;
}

.cell-container {
  display: flex;
  align-items: center;
}

.options-container {
  display: flex;
  align-items: center;
  margin-right: 30px;
  margin-left: 30px;
  color:black;
}

.options-container select {
  color: white; /* Color del texto */
  padding: 5px; /* Espaciado interno */
}

.options-container select option {
  background-color: rgba(0, 0, 0, 0.938); /* Fondo de las opciones */
  color: white; /* Color del texto */
}

.equip-container{
  display: flex;
  align-items: center;
  margin-right: 30px;
  margin-left: 30px;
}


button {
  background-color:transparent;
  border: none;
  border-radius: 100%;
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  transition: transform 0.3s ease;
}




button:hover {
  transform: scale(1.1);
}

.add-icon{
  width: 20px;
  height: 20px;
  filter: invert(100%);
}

.inline-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inline-container .cell-container,
.inline-container .radio-group {
  margin-right: 15px; /* Añadir espaciado entre elementos */
  flex: 1; /* Para que se distribuyan de manera uniforme */
}

.radio-group {
  display: flex;
  align-items: center;
  justify-content:  center;
}

.status-input {
  display: none; /* Ocultar los inputs */
}

.status-label {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: inline-block;
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer; /* Añadir cursor para que parezca clickeable */
}

/* Círculo de color */
.status-label.green {
  background-color: green;
}

.status-label.yellow {
  background-color: yellow;
}

.status-label.red {
  background-color: red;
}

/* Cambiar color a blanco al seleccionar */
.status-input:checked + .status-label {
 
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8); /* Efecto de brillo */
  transition: box-shadow 0.3s ease; /* Transición suave para el efecto de brillo */
}


.time-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Ocultar los radios */
input[type="radio"] {
  display: none;
}

.option-label {
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
}

/* Subrayado y estilo aplicado al texto cuando el radio está seleccionado */
input[type="radio"]:checked + .option-label {
  text-decoration: underline;
  font-weight: bold;
  color: rgb(0, 183, 255);
}




.action-button {
  margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 30px;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.action-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.urgencia{
  width: 150px;
  margin-top: 15px;
}

</style>
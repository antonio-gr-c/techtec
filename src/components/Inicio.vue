<template>
  <Animacion />
  <div class="container">
    <div class="window">
      <img src="https://i.postimg.cc/rpZKd7mT/Dise-o-sin-t-tulo-3.png" alt="Logo" class="top-left-image" />

      <a href="/login" rel="noopener noreferrer" class="enter-button-container">
        <span class="material-symbols-outlined enter-button">login</span>
      </a>

      <div class="content">
        <h1>Consulta el estado de tu equipo</h1>
        <div class="search-container">
          <label for="numeroServicio" class="visually-hidden">Número de Servicio</label>
          <input id="numeroServicio" v-model="numeroServicio" type="text" placeholder="Introduce tu clave de busqueda..." class="search-bar" />
          <div class="button-container">
            <button @click="buscar" class="search-button">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
        <div class="text-servicio">
          <span @click="abrirModal" class="text-info" style="text-decoration: underline; cursor: pointer;">
            No conozco mi clave de busqueda
          </span>
          <span @click="abrirModalPoliticas" class="text-info" style="text-decoration: underline; cursor: pointer;">
      Ver políticas de la empresa
    </span>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="imagenModal" tabindex="-1" aria-labelledby="imagenModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                <h5 class="modal-title" id="imagenModalLabel">Información del Servicio</h5>
                <button type="button" class="close text-light" @click="cerrarModal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <img src="https://i.postimg.cc/nhLfXRYT/Captura-de-pantalla-2024-11-11-025719.png" alt="Timeline Cycle" class="img-fluid" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de Políticas de la Empresa -->
  <div class="modal fade" id="politicasModal" tabindex="-1" aria-labelledby="politicasModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header">
          <h5 class="modal-title" id="politicasModalLabel">Políticas de la Empresa</h5>
          <button type="button" class="close text-light" @click="cerrarModalPoliticas" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            Cualquier servicio de revisión genera un costo de $250.00 por el tiempo y material invertido,
            que deberá pagarse previo a realizar su servicio.<br /><br />
            Cualquier equipo que no sea retirado una vez finalizado el trabajo y/o revisión se resguardará
            durante 7 días naturales después de dicha fecha (sin costo alguno).<br /><br />
            Posterior a esta semana se cobrarán $30.00 diarios por concepto de almacenaje.<br /><br />
            Después de 30 días naturales de haber sido resguardado el equipo, se trasladará a bodega para su
            seguridad y seguirá generando el costo de $30.00 diarios por concepto de almacenaje.<br /><br />
            Después de 45 días el equipo en resguardo será desechado, notificado con 3 días de anticipación:
            de requerir una prórroga en el plazo comuníquese al Tel: 9512062827.<br /><br />
            La empresa no se hará responsable en caso de pérdida o daño del equipo por incendio, desastre
            natural o robo.<br /><br />
            Para recoger el equipo se deberá presentar la hoja de servicio, de lo contrario no se podrá
            devolver el equipo o dispositivo entregado a revisión.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cerrarModalPoliticas">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
      </div>
    </div>
  </div>
</template>

<script>
import Animacion from '@/components/animacion.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2'; // Asegúrate de tener SweetAlert2 instalado

export default {
  components: {
    Animacion,
  },
  data() {
    return {
      numeroServicio: '',
      claves: [], // Array para almacenar las claves generadas
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted() {
    // Llamar al endpoint para cargar las claves cuando el componente se monte
    this.cargarClaves();
  },
  methods: {
    async cargarClaves() {
      try {
        const response = await axios.get('http://localhost:3000/api/generar-claves'); // Llamar al endpoint que genera las claves
        this.claves = response.data; // Almacenar las claves generadas en el array
      } catch (error) {
        console.error('Error al cargar las claves:', error);
      }
    },
    buscar() {
  const claveEncontrada = this.claves.find(clave => clave.clave === this.numeroServicio.trim());

  if (claveEncontrada) {
    // Redirigir usando la clave completa en lugar del id_servicio
    this.router.push(`/tu_equipo?clave=${encodeURIComponent(claveEncontrada.clave)}`);
  } else {
    // Mostrar SweetAlert si no se encuentra la clave
    Swal.fire({
      icon: 'error',
      title: 'No encontrado',
      text: 'El equipo no fue encontrado.',
    });
  }
},
    abrirModal() {
      // Abre el modal manualmente
      $('#imagenModal').modal('show');
    },
    cerrarModal() {
      // Cierra el modal manualmente
      $('#imagenModal').modal('hide');
    },

    abrirModalPoliticas() {
    $('#politicasModal').modal('show'); // Abre el modal de políticas
  },
  cerrarModalPoliticas() {
    $('#politicasModal').modal('hide'); // Cierra el modal de políticas
  },

  
  },
};
</script>




  <style scoped>
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
  
  .content {
    text-align: center;
    color: white;
  }
  
  .search-container {
  margin-top: 20px;
  display: flex;
  align-items: center; /* Alinea verticalmente el input y el botón */
  gap: 10px; /* Espacio entre el input y el botón */
}

  
.search-bar {
  flex: 1; /* Permite que el input tome el máximo espacio disponible */
  padding: 12px 20px;
  border: 2px solid #444;
  border-radius: 25px;
  font-size: 16px;
  margin-bottom: 0; /* Quita el margen inferior */
  background: #fff;
  color: #333;
}

  
  .search-bar:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .button-container {
    display: flex;
    gap: 10px;
  }
  
  .search-button {
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



.search-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.text-info{
  margin-right: 20px;
}

  
  @media (max-width: 768px) {
    .top-left-image {
      width: 20vw;
      max-width: 120px;
    }
  
    .enter-button {
      width: 10vw;
      max-width: 40px;
    }
  
    .search-bar {
      max-width: 90%;
      font-size: 14px;
    }
  
    .search-button, .no-service-button {
      padding: 10px 20px;
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .top-left-image {
      width: 30vw;
      max-width: 100px;
    }
  
    .enter-button {
      width: 15vw;
      max-width: 30px;
    }
  
    .search-bar {
      max-width: 90%;
      font-size: 12px;
    }
  
    .search-button, .no-service-button {
      padding: 8px 16px;
      font-size: 12px;
    }
  }
  </style>
  
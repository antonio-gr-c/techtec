<template>
    <div class="row vh-100 no-gutters">
        <!-- Menú lateral -->
        <menu-lateral />

        <!-- Contenido principal -->
        <div class="col-12 col-md-9 col-lg-10 main-content">
            <div class="container-fluid">
                <!-- Título -->
                <h1 class="text-white text-center mt-4">Panel de Trabajadores</h1>

                <!-- Barra de búsqueda, botón de regresar y botón de agregar -->
                <div class="d-flex justify-content-between align-items-center mt-4 mb-4">
                    <div class="d-flex align-items-center w-100">
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control search-bar me-3"
                            placeholder="Buscar por ID o Nombre..."
                        />
                        <button class="btn btn-secondary me-3" @click="goBack">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button class="btn btn-primary" @click="abrirModalCrearTrabajador">
                            Agregar Trabajador
                        </button>
                    </div>
                </div>

                <!-- Tabla de trabajadores -->
                <div class="table-responsive">
                    <table class="table table-dark table-hover text-center">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Número de Equipos</th>
                                <th>Rango</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="trabajador in filteredTrabajadores" :key="trabajador.id_trabajador">
                                <td>{{ trabajador.id_trabajador }}</td>
                                <td>{{ trabajador.nombre }}</td>
                                <td>{{ trabajador.equiposAsignados }}</td>
                                <td>{{ trabajador.rango }}</td>
                                <td>
                                    <span
                                        :class="{
                                            'text-success': trabajador.estado === 'disponible',
                                            'text-warning': trabajador.estado === 'instalacion_fuera',
                                            'text-info': trabajador.estado === 'servicio_a_domicilio',
                                            'text-danger': trabajador.estado === 'entregando_equipo'
                                        }"
                                    >
                                        {{ trabajador.estado }}
                                    </span>
                                </td>
                                <td class="info-button-panel">
                                    
                                    <button 
                                        class="btn btn-danger btn-sm info-button"
                                        @click="eliminarTrabajador(trabajador.id_trabajador)"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="filteredTrabajadores.length === 0">
                                <td colspan="6" class="text-center">No se encontraron trabajadores</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal para agregar trabajador -->
        <div class="modal fade" id="modalAgregarTrabajador" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar Trabajador</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="crearTrabajador">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" id="nombre" class="form-control" v-model="nuevoTrabajador.nombre" required />
                            </div>
                            <div class="mb-3">
                                <label for="apellidoPaterno" class="form-label">Apellido Paterno</label>
                                <input type="text" id="apellidoPaterno" class="form-control" v-model="nuevoTrabajador.apellidoPaterno" required />
                            </div>
                            <div class="mb-3">
                                <label for="apellidoMaterno" class="form-label">Apellido Materno</label>
                                <input type="text" id="apellidoMaterno" class="form-control" v-model="nuevoTrabajador.apellidoMaterno" required />
                            </div>
                            <div class="mb-3">
                                <label for="rango" class="form-label">Rango</label>
                                <select id="rango" class="form-select" v-model="nuevoTrabajador.rango" required>
                                    <option value="trabajador">Trabajador</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <input type="password" id="password" class="form-control" v-model="nuevoTrabajador.password" required />
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-primary">Agregar</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import MenuLateral from '@/components/menu.vue';
import Swal from 'sweetalert2';

export default {
    components: { MenuLateral },
    setup() {
        const trabajadores = ref([]);
        const searchQuery = ref('');

        const nuevoTrabajador = ref({
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            rango: 'trabajador',
            password: '',
        });

        const fetchTrabajadores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/lista-trabajadores');
                trabajadores.value = response.data;
            } catch (error) {
                console.error('Error al obtener trabajadores:', error);
            }
        };

        const filteredTrabajadores = computed(() => {
            return trabajadores.value.filter((trabajador) => {
                const query = searchQuery.value.toLowerCase();
                return (
                    trabajador.nombre.toLowerCase().includes(query) ||
                    String(trabajador.id_trabajador).includes(query)
                );
            });
        });

        const crearTrabajador = async () => {
  // Validar que los campos requeridos estén completos antes de enviar la solicitud
  if (
    !nuevoTrabajador.value.nombre ||
    !nuevoTrabajador.value.apellidoPaterno ||
    !nuevoTrabajador.value.apellidoMaterno ||
    !nuevoTrabajador.value.password ||
    !nuevoTrabajador.value.rango
  ) {
    Swal.fire('Error', 'Por favor, completa todos los campos obligatorios.', 'error');
    return;
  }

  try {
    const payload = {
      nombre: nuevoTrabajador.value.nombre,
      apellido_paterno: nuevoTrabajador.value.apellidoPaterno,
      apellido_materno: nuevoTrabajador.value.apellidoMaterno,
      password: nuevoTrabajador.value.password,
      rango: nuevoTrabajador.value.rango,
    };

    const response = await axios.post('http://localhost:3000/api/alta-trabajador', payload);
    Swal.fire('Trabajador Creado', `Se agregó a ${response.data.user}`, 'success');

    // Recargar la lista de trabajadores y resetear el formulario
    await fetchTrabajadores();
    cerrarModalCrearTrabajador();
    nuevoTrabajador.value = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', rango: 'trabajador', password: '' };
  } catch (error) {

  }
};

        const enviarNotificacion = (trabajador) => {
            Swal.fire('Notificación enviada', `Se notificó a ${trabajador.nombre}`, 'success');
        };

        const eliminarTrabajador = async (id) => {
            try {
                await axios.delete(`http://localhost:3000/api/eliminar-trabajador/${id}`);
                trabajadores.value = trabajadores.value.filter(t => t.id_trabajador !== id);
                Swal.fire('Trabajador Eliminado', 'El trabajador ha sido eliminado.', 'success');
            } catch (error) {
                console.error('Error al eliminar el trabajador:', error);
                Swal.fire('Error', 'No se pudo eliminar al trabajador.', 'error');
            }
        };

        const goBack = () => {
            window.history.back();
        };

        const abrirModalCrearTrabajador = () => {
            $('#modalAgregarTrabajador').modal('show');
        };

        const cerrarModalCrearTrabajador = () => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarTrabajador'));
            modal.hide();
        };

        onMounted(fetchTrabajadores);

        return {
            trabajadores,
            searchQuery,
            filteredTrabajadores,
            nuevoTrabajador,
            crearTrabajador,
            enviarNotificacion,
            eliminarTrabajador,
            goBack,
            abrirModalCrearTrabajador,
        };
    },
};
</script>

<style scoped>
/* Estilos estándar */
.main-content {
    margin-left: 265px;
    padding: 20px;
    overflow-y: auto;
    height: calc(100vh - 40px);
}

.table-responsive {
    overflow-x: auto;
}

.container-fluid {
    padding: 0;
    margin: 0;
}

.table {
    width: 100%;
    text-align: center;
    background-color: #343a40;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.table th,
.table td {
    padding: 12px;
    vertical-align: middle;
}

.table th {
    background-color: #495057;
    color: white;
}

.table tr:hover {
    background-color: #6c757d;
}

.search-bar {
    width: 70%;
}


</style>
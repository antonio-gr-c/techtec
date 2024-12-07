<template>
    <div class="row vh-100 no-gutters">
        <menu-lateral />

        <div class="col-12 col-md-9 col-lg-10 main-content">
            <div class="content mt-4">
                <div class="d-flex justify-content-start mb-4">
                    <input v-model="searchQuery" type="text" class="form-control search-bar" placeholder="Buscar equipo por nombre, ID o propietario" />
                    <button class="btn btn-secondary ms-3" @click="goToEliminados">
                        <span class="material-symbols-outlined">delete</span> 
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table table-dark table-hover text-center">
                        <thead>
                            <tr>
                                <th>No. servicio</th>
                                <th>Equipo</th>
                                <th>Dueño</th>
                                <th>Estado</th>
                                <th>Trabajadores Asignados</th>
                                <th>Fecha de Registro</th>
                                <th>Etiquetas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="equipo in orderedEquipos" :key="equipo.id">
                                <td>{{ equipo.id }}</td>
                                <td>{{ equipo.nombre }}</td>
                                <td>
                                    <a
                                        v-if="equipo.cliente?.celulares?.[0]"
                                        :href="`https://wa.me/${equipo.cliente.celulares[0]}`"
                                        target="_blank"
                                        class="text-info text-decoration-none"
                                    >
                                        {{ equipo.cliente?.nombre || 'Sin dueño' }}
                                    </a>
                                    <span v-else>
                                        {{ equipo.cliente?.nombre || 'Sin dueño' }}
                                    </span>
                                </td>
                                <td>{{ equipo.ubicacion }}</td>
                                <td>
                                    <button class="btn btn-link text-white" @click="openWorkerModal(equipo)" data-bs-toggle="modal" :data-bs-target="'#modalTrabajadores' + equipo.id">
                                        {{ equipo.trabajadoresAsignados?.length > 0 ? equipo.trabajadoresAsignados.map(t => t.nombre).join(', ') : 'Sin asignar' }}
                                    </button>
                                </td>
                                <td>{{ equipo.fechaRegistro }}</td>
                                <td>
                                    <div class="etiquetas">
                                        <span v-if="equipo.etiquetas?.length > 0">
                                            <span v-for="(etiqueta, index) in equipo.etiquetas" :key="index">
                                                {{ etiqueta }}<span v-if="index < equipo.etiquetas.length - 1">, </span>
                                            </span>
                                        </span>
                                        <span v-else>No hay etiquetas</span>
                                    </div>
                                    <div class="add">
                                        <button class="info-button" @click="editEtiqueta(equipo)">
                                            <span class="material-symbols-outlined">add</span>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div class="info-button-panel">
                                        <button class="btn btn-primary ms-2 info-button" @click="showDetails(equipo)" data-bs-toggle="modal" :data-bs-target="'#modal' + equipo.id">
                                            <span class="material-symbols-outlined">info</span>
                                        </button>
                                        <button @click="go(equipo.id, equipo.id_equipo)" class="info-button">
                                            <span class="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal para detalles del equipo -->
        <div v-for="equipo in equipos" :key="'modal' + equipo.id" class="modal fade" :id="'modal' + equipo.id" tabindex="-1" aria-labelledby="'modalLabel' + equipo.id" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content bg-dark text-white">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="'modalLabel' + equipo.id">{{ equipo.nombre }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark table-bordered text-white">
                            <tbody>
                                <tr>
                                    <th>Equipo</th>
                                    <td>{{ equipo.nombre }}</td>
                                </tr>
                                <tr>
                                    <th>Marca</th>
                                    <td>{{ equipo.marca }}</td>
                                </tr>
                                <tr>
                                    <th>No. Serie</th>
                                    <td>{{ equipo.noSerie }}</td>
                                </tr>
                                <tr>
                                    <th>Modelo</th>
                                    <td>{{ equipo.modelo }}</td>
                                </tr>
                                <tr>
                                    <th>Descripción</th>
                                    <td>{{ equipo.descripcion }}</td>
                                </tr>
                                <tr>
                                    <th>Estado</th>
                                    <td>{{ equipo.estado }}</td>
                                </tr>
                                <tr>
                                    <th>Etiquetas</th>
                                    <td>
                                        <span v-if="equipo.etiquetas?.length > 0">
                                            <span v-for="(etiqueta, index) in equipo.etiquetas" :key="index">
                                                {{ etiqueta }}<span v-if="index < equipo.etiquetas.length - 1">, </span>
                                            </span>
                                        </span>
                                        <span v-else>No hay etiquetas</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Cliente</th>
                                    <td>{{ equipo.cliente?.nombre }}</td>
                                </tr>
                                <tr>
                                    <th>Domicilio</th>
                                    <td>{{ equipo.cliente?.domicilio }}</td>
                                </tr>
                                <tr>
                                    <th>Celulares</th>
                                    <td>
                                        <ul>
                                            <li v-for="numero in equipo.cliente?.celulares || []" :key="numero">
                                                <a :href="`https://wa.me/${numero}`" target="_blank" class="text-info text-decoration-none">
                                                    {{ numero }}
                                                </a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>
                                        <a :href="`mailto:${equipo.cliente?.email}`" class="text-info text-decoration-none">
                                            {{ equipo.cliente?.email }}
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para trabajadores -->
        <div v-for="equipo in equipos" :key="'modalTrabajadores' + equipo.id" class="modal fade" :id="'modalTrabajadores' + equipo.id" tabindex="-1" aria-labelledby="'modalLabelTrabajadores' + equipo.id" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content bg-dark text-white">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="'modalLabelTrabajadores' + equipo.id">Trabajadores</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <h6 class="text-center">Trabajadores Asignados</h6>
                                <table class="table table-bordered table-dark text-white">
                                    <thead>
                                        <tr>
                                            <th>ID Trabajador</th>
                                            <th>Nombre</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="trabajador in equipo.trabajadoresAsignados || []" :key="trabajador.id">
                                            <td>{{ trabajador.id }}</td>
                                            <td>{{ trabajador.nombre }}</td>
                                            <td>
                                                <button class="btn btn-danger btn-sm" @click="desasignarTrabajador(equipo, trabajador)">Desasignar</button>
                                            </td>
                                        </tr>
                                        <tr v-if="equipo.trabajadoresAsignados.length === 0">
                                            <td colspan="3" class="text-center">No hay trabajadores asignados</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-6">
                                <h6 class="text-center">Trabajadores Disponibles</h6>
                                <table class="table table-bordered table-dark text-white">
                                    <thead>
                                        <tr>
                                            <th>ID Trabajador</th>
                                            <th>Nombre</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="trabajador in trabajadoresDisponibles(equipo)" :key="trabajador.id">
                                            <td>{{ trabajador.id }}</td>
                                            <td>{{ trabajador.nombre }}</td>
                                            <td>
                                                <button class="btn btn-primary btn-sm" @click="asignarTrabajador(equipo, trabajador)">Asignar</button>
                                            </td>
                                        </tr>
                                        <tr v-if="trabajadoresDisponibles(equipo).length === 0">
                                            <td colspan="3" class="text-center">No hay trabajadores disponibles</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import MenuLateral from '@/components/menu.vue';

export default {
    components: { MenuLateral },
    setup() {
        const router = useRouter();
        const searchQuery = ref('');
        const equipos = ref([]);
        const etiquetas = ref([]);
        const trabajadores = ref([]);

        // Redirigir a la sección de servicios eliminados
        const goToEliminados = () => {
            router.push('/servicios_eliminados');
        };

        // Función para obtener los equipos
        const fetchEquipos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/servicios');
                equipos.value = response.data.map(equipo => ({
                    ...equipo,
                    id: equipo.id,
                    nombre: equipo.nombre,
                    ubicacion: equipo.ubicacion,
                    cliente: equipo.cliente || {}, // Datos del cliente
                    trabajadoresAsignados: equipo.trabajadoresAsignados || [],
                }));
                await fetchEtiquetas();
                await fetchAsignaciones();
            } catch (error) {
                console.error('Error al obtener los servicios:', error);
            }
        };

        // Función para obtener las etiquetas
        const fetchEtiquetas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/etiquetas');
                etiquetas.value = response.data;
                equipos.value.forEach(equipo => {
                    equipo.etiquetas = etiquetas.value
                        .filter(et => et.id_servicio === equipo.id)
                        .map(et => et.etiqueta);
                });
            } catch (error) {
                console.error('Error al obtener las etiquetas:', error);
            }
        };

        // Función para obtener los trabajadores
        const fetchTrabajadores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/trabajadores');
                trabajadores.value = response.data.map(trabajador => ({
                    ...trabajador,
                    id: trabajador.id_trabajador, // Usar id_trabajador del endpoint
                }));
            } catch (error) {
                console.error('Error al obtener los trabajadores:', error);
            }
        };

        // Función para obtener asignaciones de trabajadores
        const fetchAsignaciones = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/servicio/asignaciones');
                const asignaciones = response.data;

                equipos.value.forEach(equipo => {
                    equipo.trabajadoresAsignados = asignaciones
                        .filter(asignacion => asignacion.id_servicio === equipo.id)
                        .map(asignacion => ({
                            id: asignacion.id_trabajador,
                            nombre: asignacion.nombre,
                        }));
                });
            } catch (error) {
                console.error('Error al obtener las asignaciones:', error);
            }
        };

        // Filtrar trabajadores disponibles
        const trabajadoresDisponibles = (equipo) => {
            return trabajadores.value.filter(
                t => !equipo.trabajadoresAsignados.some(asignado => asignado.id === t.id)
            );
        };

        // Abrir modal de trabajadores asignados
        const openWorkerModal = (equipo) => {
            equipo.trabajadoresAsignados = equipo.trabajadoresAsignados || [];
        };

        // Asignar un trabajador a un servicio
        const asignarTrabajador = async (equipo, trabajador) => {
            if (!equipo?.id || !trabajador?.id) {
                Swal.fire('Error', 'Faltan datos para asignar al trabajador.', 'error');
                return;
            }

            try {
                await axios.post('http://localhost:3000/api/asignar-trabajador', {
                    id_servicio: equipo.id,
                    id_trabajador: trabajador.id,
                });
                equipo.trabajadoresAsignados.push(trabajador);
                Swal.fire('Trabajador asignado', '', 'success');
            } catch (error) {
                console.error('Error al asignar trabajador:', error);
                Swal.fire('Error al asignar trabajador', error.response?.data?.error || '', 'error');
            }
        };

        // Desasignar un trabajador de un servicio
        const desasignarTrabajador = async (equipo, trabajador) => {
            if (!equipo?.id || !trabajador?.id) {
                Swal.fire('Error', 'Faltan datos para desasignar al trabajador.', 'error');
                return;
            }

            try {
                await axios.post('http://localhost:3000/api/desasignar-trabajador', {
                    id_servicio: equipo.id,
                    id_trabajador: trabajador.id,
                });
                equipo.trabajadoresAsignados = equipo.trabajadoresAsignados.filter(t => t.id !== trabajador.id);
                Swal.fire('Trabajador desasignado', '', 'success');
            } catch (error) {
                console.error('Error al desasignar trabajador:', error);
                Swal.fire('Error al desasignar trabajador', error.response?.data?.error || '', 'error');
            }
        };

        // Editar etiquetas de un servicio
        const editEtiqueta = (equipo) => {
            Swal.fire({
                title: 'Agregar etiqueta',
                input: 'text',
                inputPlaceholder: 'Escribe la etiqueta aquí...',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const nuevaEtiqueta = result.value || 'Sin etiqueta';

                    try {
                        await axios.post('http://localhost:3000/api/etiquetas', {
                            etiqueta: nuevaEtiqueta,
                            id_servicio: equipo.id,
                        });
                        equipo.etiquetas.push(nuevaEtiqueta);
                        Swal.fire('Etiqueta agregada', '', 'success');
                    } catch (error) {
                        console.error('Error al agregar la etiqueta:', error);
                        Swal.fire('Error al agregar la etiqueta', error.response?.data?.error || '', 'error');
                    }
                }
            });
        };

        // Navegar a detalles de un equipo
        const go = (idServicio, idEquipo) => {
            router.push(`/detalles_equipo?id_servicio=${idServicio}&id_equipo=${idEquipo}`);
        };

        // Inicializar datos al montar el componente
        onMounted(() => {
            fetchEquipos();
            fetchEtiquetas();
            fetchTrabajadores();
        });

        return {
            equipos,
            searchQuery,
            trabajadores,
            trabajadoresDisponibles,
            orderedEquipos: computed(() =>
                equipos.value.filter(equipo =>
                    equipo.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
                )
            ),
            openWorkerModal,
            asignarTrabajador,
            desasignarTrabajador,
            editEtiqueta,
            go,
            goToEliminados,
        };
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


.main-content {
    margin-left: 265px;
    /* Ajusta este valor según el ancho de tu menú */
    padding: 20px;
    /* Agrega un poco de padding si es necesario */
    overflow-y: auto;
    /* Agrega scroll si es necesario */
    height: calc(100vh - 40px);
    /* Ajusta la altura para que no exceda la pantalla */
}
.info-button-panel {
    display: flex;
    justify-content: center; /* Centra horizontalmente los botones */
    align-items: center; /* Centra verticalmente los botones */
    gap: 10px; /* Espaciado entre los botones */
}

.info-button {
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

    /* Espacio entre los botones */
}

.info-button:last-child {
    margin-right: 0;
    /* Elimina el margen derecho del último botón */
}



.info-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.etiquetas{
    display: none;
}

.table-responsive {
    overflow-x: auto;
}

.container-fluid {
    padding: 0;
    margin: 0;
}

.add{
    margin-left: 40px;
}


.table {
    width: 100%;
    text-align: center;
    background-color: #343a40; /* Color de fondo de la tabla */
    border-radius: 10px; /* Bordes redondeados */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Sombra de la tabla */
    overflow: hidden; /* Para asegurar que los bordes redondeados se vean bien */
    animation: slideIn 0.5s ease forwards;
}

.table th,
.table td {
    padding: 12px;
    border: none;
     vertical-align: middle;
}

.table th {
    background-color: #495057;
    /* Color de fondo de los encabezados */
    color: white;
    /* Color del texto de los encabezados */
}

.table tr:hover {
    background-color: #6c757d;
    /* Color de fondo al pasar el cursor */
}

.search-bar {
    width: 30%;

}

input[type="text"] {
    margin-top: 30px;
    margin-bottom: 10px;
    animation: slideIn 0.5s ease forwards;
}

.no-gutters {
    margin-right: 0;
    margin-left: 0;
}

.row {
    margin: 0;
}
</style>
<template>
    <div class="row vh-100 no-gutters">
        <menu-lateral />

        <div class="col-12 col-md-9 col-lg-10 main-content">
            <div class="content mt-4">
                <div class="d-flex justify-content-between mb-4">
                    <input v-model="searchQuery" type="text" class="form-control search-bar me-3" placeholder="Buscar equipo por nombre, ID o propietario" />
                    <button class="btn btn-secondary" @click="abrirModalEstado">
                        Cambiar Estado
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table table-dark table-hover text-center">
                        <thead>
                            <tr>
                                <th>No. servicio</th>
                                <th>Equipo</th>
                                <th>Estado</th>
                                <th>Trabajador Asignado</th>
                                <th>Fecha de Registro</th>
                                <th>Etiquetas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="equipo in orderedEquipos" :key="equipo.id">
                                <td>{{ equipo.id }}</td>
                                <td>{{ equipo.nombre }}</td>
                                <td>{{ equipo.ubicacion }}</td>
                                <td>{{ equipo.propietario }}</td>
                                <td>{{ equipo.fechaRegistro }}</td>
                                <td>
                                    <div class="etiquetas">
                                        <span v-if="equipo.etiquetas.length > 0">
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

        <!-- Modal Cambiar Estado -->
        <div class="modal fade" id="modalCambiarEstado" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-dark">
                    <div class="modal-header">
                        <h5 class="modal-title">Cambiar Estado</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="cambiarEstado">
                            <div class="mb-3">
                                <label for="estado" class="form-label">Seleccione el nuevo estado</label>
                                <select id="estado" class="form-select" v-model="nuevoEstado" required>
                                    <option value="disponible">Disponible</option>
                                    <option value="instalacion_fuera">Instalación Fuera</option>
                                    <option value="servicio_a_domicilio">Servicio a Domicilio</option>
                                    <option value="entregando_equipo">Entregando Equipo</option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-primary">Actualizar Estado</button>
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
        const nuevoEstado = ref('disponible');

        // Función para abrir el modal de cambiar estadoNIFGRWNIGRWNPEPÑOGRWPOGRW
        const abrirModalEstado = () => {
            $('#modalCambiarEstado').modal('show');
        };

        // Función para cambiar el estado del trabajador
        const cambiarEstado = async () => {
            try {
                const userId = localStorage.getItem('userId');
                await axios.put(`http://localhost:3000/api/trabajadores/estado/${userId}`, { estado: nuevoEstado.value });
                Swal.fire('Estado Actualizado', 'El estado ha sido cambiado correctamente', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCambiarEstado'));
                modal.hide();
            } catch (error) {
                
            }
        };

        const fetchEquipos = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:3000/api/servicios/${userId}`);
                equipos.value = response.data;
                await fetchEtiquetas();
            } catch (error) {
                console.error('Error al obtener los servicios:', error);
            }
        };

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
                            id_servicio: equipo.id
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

        const go = (idServicio, idEquipo) => {
            router.push(`/detalles_equipo?id_servicio=${idServicio}&id_equipo=${idEquipo}`);
        };

        const orderedEquipos = computed(() =>
            equipos.value.filter((equipo) =>
                equipo.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
            )
        );

        onMounted(() => {
            fetchEquipos();
        });

        return {
            equipos,
            searchQuery,
            orderedEquipos,
            editEtiqueta,
            go,
            abrirModalEstado,
            cambiarEstado,
            nuevoEstado,
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
.modal-dark {
  background-color: #343a40; /* Fondo oscuro del modal */
  color: #f8f9fa; /* Texto claro */
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
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
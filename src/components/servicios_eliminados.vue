<template>
    <div class="row vh-100 no-gutters">
        <!-- Menú lateral -->
        <menu-lateral />

        <!-- Contenido principal -->
        <div class="col-12 col-md-9 col-lg-10 main-content">
            <div class="container-fluid">
                <!-- Título principal -->
                <h1 class="text-white text-center mt-4">Servicios Eliminados</h1>

                <!-- Barra de búsqueda y botón de regresar -->
                <div class="d-flex justify-content-between align-items-center mt-4 mb-4">
                    <input
                        v-model="searchQuery"
                        type="text"
                        class="form-control search-bar me-3"
                        placeholder="Buscar por equipo, descripción, dueño..."
                    />
                    <button class="btn btn-secondary" @click="goBack">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                </div>

                <!-- Tabla de servicios eliminados -->
                <div class="table-responsive mt-4">
                    <table class="table table-dark table-hover text-center">
                        <thead>
                            <tr>
                                <th>ID Servicio</th>
                                <th>Nombre Equipo</th>
                                <th>Descripción</th>
                                <th>Ubicación</th>
                                <th>Fecha Eliminación</th>
                                <th>Dueño</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="servicio in filteredServicios" :key="servicio.id">
                                <td>{{ servicio.id_servicio }}</td>
                                <td>{{ servicio.nombre_equipo }}</td>
                                <td>{{ servicio.descripcion }}</td>
                                <td>{{ servicio.ubicacion }}</td>
                                <td>{{ servicio.fecha_eliminacion }}</td>
                                <td>{{ servicio.nombre_duenio || 'Sin dueño' }}</td>
                                <td>
                                    <a
                                        v-if="servicio.email_duenio"
                                        :href="`mailto:${servicio.email_duenio}`"
                                        class="text-info text-decoration-none"
                                    >
                                        {{ servicio.email_duenio }}
                                    </a>
                                    <span v-else>Sin email</span>
                                </td>
                            </tr>
                            <tr v-if="filteredServicios.length === 0">
                                <td colspan="7" class="text-center">No se encontraron servicios eliminados</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import MenuLateral from '@/components/menu.vue';

export default {
    components: { MenuLateral },
    setup() {
        const serviciosEliminados = ref([]);
        const searchQuery = ref('');

        // Función para obtener los servicios eliminados
        const fetchServiciosEliminados = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/eliminados');
                serviciosEliminados.value = response.data;
            } catch (error) {
                console.error('Error al obtener los servicios eliminados:', error);
            }
        };

        // Computed para filtrar los servicios según el buscador
        const filteredServicios = computed(() => {
            return serviciosEliminados.value.filter((servicio) => {
                const query = searchQuery.value.toLowerCase();
                return (
                    servicio.nombre_equipo?.toLowerCase().includes(query) ||
                    servicio.descripcion?.toLowerCase().includes(query) ||
                    servicio.nombre_duenio?.toLowerCase().includes(query) ||
                    servicio.email_duenio?.toLowerCase().includes(query)
                );
            });
        });

        // Función para regresar a la página anterior
        const goBack = () => {
            window.history.back();
        };

        // Cargar los datos al montar el componente
        onMounted(() => {
            fetchServiciosEliminados();
        });

        return {
            serviciosEliminados,
            searchQuery,
            filteredServicios,
            goBack,
        };
    },
};
</script>

<style scoped>
/* Estilos proporcionados */
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
    color: white;
}

.table tr:hover {
    background-color: #6c757d;
}

.search-bar {
    width: 70%;
}

input[type="text"] {
    margin-top: 0;
    margin-bottom: 0;
    animation: slideIn 0.5s ease forwards;
}

.no-gutters {
    margin-right: 0;
    margin-left: 0;
}

.row {
    margin: 0;
}

.text-white {
    color: white;
}
</style>
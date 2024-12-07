<template>
  <div class="col-100 col-md-300 col-lg-2 sidebar d-flex flex-column align-items-center py-4">
    <img src="https://i.postimg.cc/rpZKd7mT/Dise-o-sin-t-tulo-3.png" alt="logo" class="profile-pic" />
    <h4 class="text-white">{{ trabajador.nombre }}</h4>
    <div class="buttons-container">
      <button @click="goToHojaServicio" class="action-button" aria-label="Registrar equipo nuevo">
        Regitro de equipos
        <span class="material-symbols-outlined">app_registration</span>
      </button>
      
      <button @click="goPanel" class="action-button" aria-label="Panel">
        Panel de equipos
        <span class="material-symbols-outlined">table</span>
      </button>
      <div class="notification-button-container">
        <button @click="toggleNotifications" class="action-button" aria-label="Notificaciones">
         Notificaciones
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-badge" :class="{ 'no-notifications': filteredNotifications.length === 0 }">
            {{ filteredNotifications.length > 0 ? filteredNotifications.length : '0' }}
          </span>
        </button>
        <!-- Panel de notificaciones -->
    <transition name="slide-fade">
      <div v-if="showNotifications" class="notifications-panel">
        <h5 class="text-white">Notificaciones</h5>
        <ul class="notifications-list">
          <li
            v-for="(notification, index) in filteredNotifications"
            :key="index"
            class="alerta"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-container">
              <div class="notification-content">
                <div class="content">
                  <h6>{{ generarTitulo(notification.tipo) }}</h6>
                  <p>{{ generarMensaje(notification) }}</p>
                </div>
              </div>
              <div class="hover-overlay">
                <span>Ver</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>

        <button @click="go" class="action-button" aria-label="Cerrar sesión">
        logout
        <span class="material-symbols-outlined">logout</span>
      </button>
      </div>
    </div>

    

    

  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"; // Agrega onBeforeUnmount aquí
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const trabajador = ref({ nombre: "" });
    const showNotifications = ref(false);
    const notifications = ref([]); // Array de notificaciones obtenido del endpoint
    const userId = parseInt(localStorage.getItem("userId")); // Convertir a entero para comparar con IDs
    let notificationInterval = null; // Variable para almacenar el intervalo

    // Filtrar notificaciones por id_destinatario
    const filteredNotifications = computed(() =>
      notifications.value.filter((notification) => notification.id_destinatario === userId)
    );

    const generarTitulo = (tipo) => {
    if (tipo === "nuevo_servicio") return "Nuevo servicio registrado";
    if (tipo === "movimiento") return "Nuevo servicio asignado";
    if (tipo === "desasignacion") return "Desasignación de equipo";
    return "Notificación";
};


    const generarMensaje = (notification) => {
    if (notification.tipo === "nuevo_servicio") {
        return `${notification.nombre_trabajador} ha registrado un nuevo servicio`;
    }
    if (notification.tipo === "movimiento") {
        return `Se te ha asignado el servicio número ${notification.id_servicio}`;
    }
    if (notification.tipo === "desasignacion") {
        return `Se te ha desasignado el servicio número ${notification.id_servicio}`;
    }
    return "Notificación general";
};


    const fetchTrabajador = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/trabajadores/${userId}`);
          const { nombre, apellido_paterno, apellido_materno } = response.data;
          trabajador.value.nombre = `${nombre} ${apellido_paterno} ${apellido_materno}`;
        } catch (error) {
          console.error("Error al obtener los datos del trabajador:", error);
          trabajador.value.nombre = "Error al cargar";
        }
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/notificaciones");
        notifications.value = response.data;
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const handleNotificationClick = async (notification) => {
    try {
        if (notification.tipo === "desasignacion") {
            // Redirigir a /panel si el tipo es desasignacion
            window.location.href = "/panel";
        } else {
            // Redirigir a la página de detalles del equipo para otros tipos de notificación
            const url = `http://localhost:5173/detalles_equipo?id_servicio=${notification.id_servicio}&id_equipo=${notification.id_equipo}`;
            window.location.href = url;
        }

        // Eliminar la notificación del backend
        await axios.delete(`http://localhost:3000/api/notificaciones/${notification.id_notificacion}`);
        
        // Actualizar la lista de notificaciones localmente
        notifications.value = notifications.value.filter(
            (n) => n.id_notificacion !== notification.id_notificacion
        );
    } catch (error) {
        console.error("Error al manejar la notificación:", error);
    }
};


    onMounted(() => {
      fetchTrabajador();
      fetchNotifications();

      // Configurar un intervalo para recargar las notificaciones periódicamente
      notificationInterval = setInterval(fetchNotifications, 5000); // Recargar cada 5 segundos
    });

    onBeforeUnmount(() => {
      // Limpiar el intervalo al desmontar el componente
      clearInterval(notificationInterval);
    });

    const goToHojaServicio = () => {
      router.push("/hoja_servicio");
    };

    const go = () => {
      localStorage.clear();
      router.push("/login");
    };

    const goPanel = () => {
      router.push("/panel");
    };


    return {
      trabajador,
      goToHojaServicio,
      go,
      goPanel,
      toggleNotifications,
      showNotifications,
      filteredNotifications,
      generarTitulo,
      generarMensaje,
      handleNotificationClick,
    };
  },
};

</script>

<style scoped>

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.sidebar {
  position: fixed;
  background-color: #292a2b;
  height: 100vh;
  color: white;
  text-align: center;
  box-shadow: 14px 5px 20px 0px rgba(0, 0, 0, 0.4);
}
.profile-pic {
  width: 100%;
  margin-top: 10px;
  margin-bottom: -10px;
}
.nav-link {
  color: white;
}
.nav-link:hover {
  color: #007bff;
}
.nav-link.active {
  font-weight: bold;
  color: #0056b3;
}
.buttons-container {
  display: block;
  margin-bottom: 10px;
  margin-top: 10px;
}
.action-button {
  margin-left: 5px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.action-button:hover {
  background-color: #0056b3;
  
}
.notifications-panel {
  background-color: #1c1c1c;
  border-radius: 8px;
  padding: 10px;
  width: 90%;
  margin-top: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  max-height: 200px;
  overflow-y: auto;
}
.notifications-panel::-webkit-scrollbar {
  width: 5px;
}
.notifications-panel::-webkit-scrollbar-thumb {
  background-color: rgba(0, 123, 255, 0.8);
  border-radius: 10px;
}
.notifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.notifications-list li {
  position: relative;
  margin-bottom: 10px;
}
.notification-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}
.notification-content {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #2a2a2a;
  z-index: 1;
  position: relative;
}
.notification-content .content h6 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}
.notification-content .content p {
  margin: 0;
  font-size: 12px;
  color: #d3d3d3;
}
.hover-overlay {
  position: absolute;
  top: 0;
  left: 100%;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 123, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease-in-out;
  z-index: 2;
}
.notification-container:hover .hover-overlay {
  left: 0;
}
.hover-overlay span {
  color: white;
  font-size: 14px;
  font-weight: bold;
}
.notification-button-container {
  position: relative;
}
.notification-badge {
  position: absolute;
  top: 9px;
  right: 20px;
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notification-badge.no-notifications {
  background-color: gray;
}
</style>

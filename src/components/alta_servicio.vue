<template>
  <div class="form-container">
    <h2>{{ isEditing ? 'Editar Servicio' : 'Crear Nuevo Servicio' }}</h2>
    <button @click="toggleEditMode" class="btn btn-secondary">
      {{ isEditing ? 'Alta' : 'Edición' }}
    </button>
    
    <form class="form" @submit="submitForm">
      <!-- Nombre del servicio -->
      <div class="mb-3">
        <label for="service-name" class="form-label">Nombre del Servicio</label>
        <input
          type="text"
          id="service-name"
          class="form-control"
          placeholder="Ingresa el nombre del servicio"
          v-model="currentService.name"
          required
        />
      </div>

      <!-- Asignar equipo -->
      <div class="mb-3">
        <label for="assigned-equipment" class="form-label">Asignar Equipo</label>
        <select
          id="assigned-equipment"
          class="form-select"
          v-model="currentService.equipment"
          required
        >
          <option value="" disabled>Selecciona el equipo</option>
          <option value="laptop">Laptop</option>
          <option value="desktop">Escritorio</option>
          <option value="mac">Mac</option>
          <option value="camera">Cámara</option>
        </select>
      </div>

      <!-- Tipo de servicio (Hardware/Software) -->
      <div class="mb-3">
        <label for="service-type" class="form-label">Tipo de Servicio</label>
        <div class="d-flex align-items-center">
          <div class="form-check me-3">
            <input
              class="form-check-input"
              type="radio"
              name="service-type"
              id="hardware"
              value="hardware"
              v-model="currentService.type"
            />
            <label class="form-check-label" for="hardware">Hardware</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="service-type"
              id="software"
              value="software"
              v-model="currentService.type"
            />
            <label class="form-check-label" for="software">Software</label>
          </div>
        </div>
      </div>

      <!-- Pasos del servicio -->
      <div class="mb-3">
        <h5>Pasos del Servicio</h5>
        <div v-for="(step, index) in currentService.steps" :key="index" class="mb-4">
          <div class="mb-3">
            <label :for="'step-name-' + index" class="form-label">Paso {{ index + 1 }}: Nombre del Paso</label>
            <input
              type="text"
              class="form-control"
              :id="'step-name-' + index"
              v-model="step.name"
              placeholder="Nombre del paso"
              required
            />
          </div>
          <div class="mb-3">
            <label :for="'general-desc-' + index" class="form-label">Descripción General</label>
            <textarea
              class="form-control"
              :id="'general-desc-' + index"
              v-model="step.generalDesc"
              rows="2"
              placeholder="Descripción general de lo que se hará en este paso"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label :for="'detailed-desc-' + index" class="form-label">Descripción Detallada</label>
            <textarea
              class="form-control"
              :id="'detailed-desc-' + index"
              v-model="step.detailedDesc"
              rows="3"
              placeholder="Descripción detallada de los pasos"
              required
            ></textarea>
          </div>
          <!-- Botón para eliminar paso -->
          <button
            type="button"
            class="btn btn-danger btn-sm remove-step-btn"
            @click="removeStep(index)"
          >
            <img src="https://cdn-icons-png.flaticon.com/128/1617/1617543.png" class="submit-icon">
          </button>
        </div>

        <!-- Botón para agregar más pasos -->
        <button
          type="button"
          class="btn btn-primary add-step-btn"
          @click="addStep"
        >
          <img src="https://cdn-icons-png.flaticon.com/128/992/992651.png" class="submit-icon">
        </button>
      </div>

      <!-- Botón para publicar servicio -->
      <button type="submit" class="btn btn-success submit-btn">
        <img src="https://cdn-icons-png.flaticon.com/128/13956/13956660.png" class="submit-icon">
      </button>
    </form>

    <!-- Listado de servicios ofrecidos -->
    <div class="mt-5">
      <h3>Servicios Ofrecidos</h3>
      <!-- Filtro -->
      <div class="mb-3 d-flex justify-content-between">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar servicio..."
          class="form-control w-50"
        />
        <select v-model="filterType" class="form-select w-25">
          <option value="" disabled>Filtrar por tipo</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
        </select>
        <select v-model="filterEquipment" class="form-select w-25">
          <option value="" disabled>Filtrar por equipo</option>
          <option value="laptop">Laptop</option>
          <option value="desktop">Escritorio</option>
          <option value="mac">Mac</option>
          <option value="camera">Cámara</option>
        </select>
      </div>

      <!-- Tabla de servicios -->
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>Nombre del Servicio</th>
            <th>Equipo</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in filteredServices" :key="index">
            <td>{{ service.name }}</td>
            <td>{{ service.equipment }}</td>
            <td>{{ service.type }}</td>
            <td>
              <button class="btn btn-info btn-sm" @click="editService(index)">
                <img src="https://cdn-icons-png.flaticon.com/128/2356/2356780.png" class="submit-icon">
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteService(index)">
                <img src="https://cdn-icons-png.flaticon.com/128/1617/1617543.png" class="submit-icon">
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isEditing: false,
      currentService: {
        name: '',
        equipment: '',
        type: '',
        steps: []
      },
      services: [
        {
          name: 'Reparación de teclado',
          equipment: 'laptop',
          type: 'hardware',
          steps: [
            {
              name: 'Desarmar el equipo',
              generalDesc: 'Desmontar la carcasa de la laptop para acceder al teclado.',
              detailedDesc: 'Quitar los tornillos de la parte inferior de la laptop y desmontar la carcasa.'
            },
            {
              name: 'Limpieza del teclado',
              generalDesc: 'Limpiar el teclado y revisar su estado general.',
              detailedDesc: 'Remover el teclado, limpiarlo con aire comprimido y verificar que todas las teclas funcionen correctamente.'
            },
            {
              name: 'Reemplazo de piezas',
              generalDesc: 'Reemplazar teclas o el teclado completo si es necesario.',
              detailedDesc: 'Instalar teclas nuevas o un teclado nuevo en caso de ser irreparable.'
            }
          ]
        }
      ],
      searchTerm: '',
      filterType: '',
      filterEquipment: ''
    };
  },
  computed: {
    filteredServices() {
      let filtered = this.services;
      if (this.searchTerm) {
        filtered = filtered.filter(service =>
          service.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      if (this.filterType) {
        filtered = filtered.filter(service => service.type === this.filterType);
      }
      if (this.filterEquipment) {
        filtered = filtered.filter(service => service.equipment === this.filterEquipment);
      }
      return filtered;
    }
  },
  methods: {
    addStep() {
      this.currentService.steps.push({
        name: '',
        generalDesc: '',
        detailedDesc: ''
      });
    },
    removeStep(index) {
      this.currentService.steps.splice(index, 1);
    },
    submitForm(event) {
      event.preventDefault();
      if (this.isEditing) {
        // Si está editando, actualiza el servicio
        this.services = this.services.map(service =>
          service === this.currentService ? this.currentService : service
        );
      } else {
        // Si no está editando, añade un nuevo servicio
        this.services.push({ ...this.currentService });
      }
      this.resetForm();
    },
    editService(index) {
      this.currentService = { ...this.services[index] };
      this.isEditing = true;
    },
    deleteService(index) {
      this.services.splice(index, 1);
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
      this.resetForm();
    },
    resetForm() {
      this.currentService = {
        name: '',
        equipment: '',
        type: '',
        steps: []
      };
    }
  }
};
</script>


<style scoped>
  /* Contenedor del formulario principal */
  .form-container {
    border-radius: 8px;
    padding: 20px;
    max-width: 800px;
    margin: 40px auto;
    background-color: rgba(0, 0, 0, 0.575);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.719);
  }

  /* Estilos para los textos */
  .form-label,
  h2,
  h3 {
    color: white;
  }

  /* Estilos generales del formulario */
  .form {
    display: flex;
    flex-direction: column;
    color: white;
  }

  /* Estilos generales para los botones */
  button {
    background-color: transparent;
    border: none;
    border-radius: 100%;
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-left: 10px;
    transition: transform 0.3s ease;
  }

  /* Efecto hover en los botones */
  button:hover {
    transform: scale(1.1);
  }

  /* Botón para agregar pasos */
  .add-step-btn {
    background-color: #00aaff;
    color: white;
    border-radius: 4px;
    padding: 10px 15px;
    margin-top: 10px;
    transition: background-color 0.3s ease;
  }

  /* Efecto hover para el botón de agregar pasos */
  .add-step-btn:hover {
    background-color: #0077cc;
  }

  /* Botón para eliminar pasos */
  .remove-step-btn {
    background-color: #ff5555;
    color: white;
    border-radius: 4px;
    padding: 10px 15px;
    transition: background-color 0.3s ease;
  }

  /* Efecto hover para el botón de eliminar pasos */
  .remove-step-btn:hover {
    background-color: #cc3333;
  }

  /* Botón de enviar formulario */
  .submit-btn {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 10px 20px;
    font-size: 16px;
    margin-top: 20px;
    transition: background-color 0.3s ease;
  }

  /* Efecto hover para el botón de enviar */
  .submit-btn:hover {
    background-color: #218838;
  }

  /* Contenedor de los pasos */
  .paso-container {
    margin-bottom: 20px;
  }

  /* Tabla de servicios */
  .table {
    margin-top: 20px;
    color: white;
    background-color: #333;
  }

  /* Iconos dentro de los botones */
  .add-icon,
  .submit-icon {
    width: 20px;
    height: 20px;
    filter: invert(100%);
  }

  .submit-icon:hover {
    filter: invert(100%);
  }

</style>

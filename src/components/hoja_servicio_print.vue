<template>
    <menu-lateral />

    

    <div class="container">
<div class="pdf-container">
      <div v-if="formData" ref="pdfContent" class="pdf-content">
        <!-- Primera hoja: Encabezado y datos del cliente -->
        <div class="encabezado">
          <table class="table-encabezado">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>No. Servicio</th>
                <th>Clave de busqueda</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ formData.fecha }}</td>
                <td>{{ formData.id_servicio }}</td>
                <td>{{clavesGeneradas.clave}}</td>
              </tr>
            </tbody>
          </table>
          <div class="empresa-info">
            <img class="logo" src="https://i.postimg.cc/vHY2rdq1/Dise-o-sin-t-tulo.png">
            <p>C. de Manuel Fernandez Fiallo 315 int 1</p>
            <p>Col centro, Oaxaca de Juarez</p>
            <p>Teléfono: 9512062827</p>
          </div>
        </div>
  
        <!-- Tabla para datos del cliente -->
        <table class="table">
          <thead>
            <tr>
              <th colspan="2">DATOS DEL CLIENTE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NOMBRE:</td>
              <td>{{ formData.cliente }}</td>
            </tr>
            <tr>
              <td>DOMICILIO:</td>
              <td>{{ formData.domicilio }}</td>
            </tr>
            <tr>
              <td>EMAIL:</td>
              <td>{{ formData.email }}</td>
            </tr>
            <tr>
              <td>CELULAR(ES):</td>
              <td>{{ formData.celulares }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Tabla para datos del equipo -->
        <table class="table">
          <thead>
            <tr>
              <th colspan="2">DATOS DEL EQUIPO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EQUIPO:</td>
              <td>{{ formData.tipo_equipo }}</td>
            </tr>
            <tr>
              <td>MARCA:</td>
              <td>{{ formData.marca }}</td>
            </tr>
            <tr>
              <td>MODELO:</td>
              <td>{{ formData.modelo }}</td>
            </tr>
            <tr>
              <td>ESTADO:</td>
              <td>{{ formData.estado }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Tabla para descripción del equipo -->
        <table class="table">
          <thead>
            <tr>
              <th>DESCRIPCION DEL EQUIPO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ formData.descripcion_equipo }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Tabla para observaciones -->
        <table class="table">
          <thead>
            <tr>
              <th>OBSERVACIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ formData.observaciones }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Tabla para agregados -->
        <table class="table">
          <thead>
            <tr>
              <th>AGREGADOS</th>
              <th>DESCRIPCIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ formData.agregado }}</td>
              <td>{{ formData.descripcion_agregado }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Tabla para tipo de servicio y tiempo de entrega -->
        <table class="table">
          <tbody>
            <tr>
              <td><strong>TIPO DE SERVICIO:</strong> {{ formData.tipo_servicio }}</td>
              <td><strong>TIEMPO DE ENTREGA ESTIMADO:</strong> {{ formData.tiempo_entrega }}</td>
              <td><strong>COSTO ESTIMADO:</strong> ${{ formData.costo }}</td>
            </tr>

          </tbody>
        </table>

       
  

      </div>
      <div class="botonera">
    <button class="action-button" @click="generarPDF">
        <span class="material-symbols-outlined">print</span>
    </button>
    </div>
    </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
  import MenuLateral from '@/components/menu.vue';
  
  export default {

    components: {
        MenuLateral, // Registrar el componente
    },
    data() {
      return {
        formData: null,
        clavesGeneradas: [],
      };
    },

    mounted() {
      this.fetchData(); 
    },
    methods: {

      async generarClaves(idServicio) {
      try {
        // Realizar la solicitud al endpoint para generar claves
        const response = await axios.get(`http://localhost:3000/api/generar-claves/${idServicio}`);

        // Guardar las claves generadas en el array
        this.clavesGeneradas = response.data;

      } catch (error) {
        // Manejo de errores si la solicitud falla
        console.error('Error al generar las claves:', error);
      }
    },

      async fetchData() {
        try {
          const idServicio = this.$route.params.idServicio; // Capturamos el idServicio de la ruta
          const response = await axios.get('http://localhost:3000/api/registro');
          const servicio = response.data.find((item) => item.id_servicio === parseInt(idServicio)); // Convertir idServicio a número
          if (servicio) {
            this.formData = servicio;
            this.generarClaves(servicio.id_servicio);
          } else {
            console.error(`No se encontró el servicio con id_servicio = ${idServicio}`);
          }
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      },
      async generarPDF() {
    const pdfContent = this.$refs.pdfContent;
    if (pdfContent) {
        const canvas = await html2canvas(pdfContent, { scale: 1.2 }); // Reducir escala para ajustar el contenido
        const imgData = canvas.toDataURL('image/png');

        // URL del código QR y logo
        const qrCodeUrl = "https://i.postimg.cc/k4F6KQPN/qrcode.png";
        const logoUrl = "https://i.postimg.cc/vHY2rdq1/Dise-o-sin-t-tulo.png";

        // Crear una nueva ventana
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
              <head>
                <title>Imprimir</title>
                <style>
                  @media print {
                    body {
                      margin: 0;
                      padding: 0;
                      font-family: Arial, sans-serif;
                    }
                    .pdf-content {
                      width: 6in; /* Ancho más pequeño para reducir contenido */
                      height: 10in; /* Altura más pequeña */
                      margin: 0 auto; /* Centrar el contenido */
                      
                      transform-origin: top left; /* Mantener anclado al inicio */
                    }
                    img {
                      max-width: 100%;
                      height: auto;
                      display: block;
                      margin: 0 auto;
                    }
                    .logo {
                      position: absolute;
                      top: -7px;
                      right: 70px;
                      width: 200px;
                      height: auto;
                    }
                    .qr-section {
                      text-align: center;
                      margin: 10px 0;
                      display: flex;
                      margin-botton: 0px
                    }
                    .qr-code {
                      width: 100px; /* Tamaño más pequeño para ajustar */
                      height: auto;
                      display: flex;
                      margin: 0 auto;
                    }
                    .signature {
                      text-align: center;
                      margin-top: 20px; /* Espaciado reducido */
                      font-style: italic;
                    }
                    .firma-linea {
                      border-top: 1px solid #2b2b2b;
                      width: 150px; /* Línea más corta */
                      margin: 1px auto; /* Espaciado reducido */
                    }
                  }
                </style>
              </head>
              <body>
                <div class="pdf-content">
                  <!-- Logo de la empresa -->
                  <img class="logo" src="${logoUrl}" alt="Logo de la empresa" />

                  <!-- Contenido principal -->
                  <img src="${imgData}" />

                  <!-- Sección QR -->
                  <div class="qr-section">
                    <p>Puedes consultar el estado de tu equipo y las políticas de la empresa escaneando el siguiente código QR:</p>
                    <img class="qr-code" src="${qrCodeUrl}" alt="Código QR" />
                  </div>

                  <!-- Firma -->
                  <div class="signature">
                    <div class="firma-linea"></div> <!-- Línea para firmar -->
                    <p>${this.formData.cliente}</p>
                  </div>
                </div>
              </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.onload = function () {
            printWindow.print();
            printWindow.close();
        };
    }
},



      
    },
  };
  </script>
  
  
  <style scoped>

.qr-section {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
}

.qr-section p {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.qr-code {
  width: 150px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.container { 
  max-width: 1080px;
  margin: 0 auto; 
  position: relative; 
  flex-direction: column;
  max-height: 1000vh;
  overflow-y: hidden;
  left: 7%;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-height: 100vh; /* Limita la altura del contenedor */
  overflow-y: auto; /* Agrega scroll cuando el contenido excede la altura */
}

.pdf-container::-webkit-scrollbar {
  display: none; /* Ocultar la barra de desplazamiento */
}

/* Ocultar la barra de desplazamiento en Firefox */
.pdf-container {
  scrollbar-width: none; /* Ocultar la barra de desplazamiento */
}

  .pdf-content {
    width: 100%;
    max-width: 800px;
    padding: 20px;
    background-color: white;
    margin-top: 0px;
    border-radius: 8px;
  }

  
  .encabezado {
    display: flex;
    justify-content: space-between; /* Espacio entre los elementos */
    align-items: flex-start; /* Alinear elementos al inicio */
  }
  
  .empresa-info {
    text-align: right; /* Alinear texto a la derecha */
    margin-left: 20px; /* Espacio entre la tabla y la información de la empresa */
    line-height: 0.5;
    font-size: 15px;
    margin-right: 10px;
  }
  
  .logo {
    width: 200px;
    margin-bottom: -20px;
    margin-right: -17px;
  }
  
  .table-encabezado {
    height: 50%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .table-encabezado th,
  .table-encabezado td {
    border: 1px solid #2b2b2b;
    padding: 10px;
    text-align: left;
  }
  .table-encabezado th {
    background-color: #373737;
    color: #f4f4f4;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .table th,
  .table td {
    border: 1px solid #2b2b2b;
    padding: 10px;
    text-align: left;
  }
  .table th {
    background-color: #373737;
    color: #f4f4f4;
  }
  .signature {
    display: flex;
    flex-direction: column; /* Alinear los hijos en una columna */
    align-items: center; /* Centrar elementos en el eje transversal */
    margin-top: 90px;
    font-style: italic;
  }
  
  .firma-linea {
    border-top: 1px solid #2b2b2b; /* Línea superior */
    width: 200px; /* Ancho de la línea */
    margin-bottom: 10px; /* Espaciado debajo de la línea */
  }

  .botonera{
    margin-top: 40px;
    margin-bottom: 20px;
  }

  .action-button {
    margin-left: 5px;
    margin-right: 5px;
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

.action-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}
  </style>
  
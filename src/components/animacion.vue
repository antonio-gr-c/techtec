<template>
    <div class="overlay" v-if="showLogo">
      <img src="https://i.postimg.cc/rpZKd7mT/Dise-o-sin-t-tulo-3.png" alt="Logo" class="logo" />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showLogo: true,
      };
    },
    mounted() {
      setTimeout(() => {
        this.showLogo = false;
      }, 3000); // Duración de la animación
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.712);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Asegura que el overlay esté por encima del contenido */
  }
  
  .logo {
    width: 400px;
    height: auto;
    opacity: 0;
    animation: fadeInOut 3s ease-in-out;
  }
  
  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  </style>
  
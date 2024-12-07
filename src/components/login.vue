<template>
  <div class="container">
    <div class="window">
      <button class="back-button" @click="goBack">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <div class="login-section">
        <div class="login-form">
          <h1>Login</h1>
          <input v-model="user" type="text" placeholder="User..." class="input-field" />
          <input v-model="password" type="password" placeholder="Password" class="input-field" />
          <button @click="handleLogin" class="login-button">
            <span class="material-symbols-outlined">check</span>
          </button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> <!-- Mensaje de error -->
        </div>
      </div>
      <div class="image-section">
        <img src="https://i.postimg.cc/rpZKd7mT/Dise-o-sin-t-tulo-3.png" alt="Logo" class="image" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue'; 
import axios from 'axios'; 

export default {
  setup() {
    const router = useRouter();

    // Define las propiedades reactivas con ref
    const user = ref('');
    const password = ref('');
    const errorMessage = ref(''); // Para mostrar mensajes de error

   // Método de login
   const handleLogin = async () => {
  errorMessage.value = ''; // Reinicia el mensaje de error

  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      user: user.value,
      password: password.value,
    });

    const { token, userId, role } = response.data; // Obtener el rol del usuario
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);

    // Redirigir según el rol
    if (role === 'jefe') {
      router.push('/panel_jefe');
    } else if (role === 'administrador') {
      router.push('/panel_admin');
    } else {
      router.push('/panel');
    }
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message; // Muestra mensaje del servidor
    } else {
      errorMessage.value = 'Error de conexión, intenta de nuevo'; // Mensaje genérico
    }
  }
};

    const goBack = () => {
      router.push('/');
    };

    return {
      user,
      password,
      errorMessage,
      handleLogin,
      goBack,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}

.window {
  display: flex;
  width: 90vw;
  max-width: 1500px;
  height: 80vh;
  max-height: 1200px;
  position: relative;
  border-radius: 15px;
  box-shadow: 12px 13px 15px -4px rgba(0, 0, 0, 0.4);
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  padding: 12px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.back-button:hover {
  transform: scale(1.1);
}

.login-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.575);
  border-radius: 15px 0 0 15px;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.input-field {
  width: 100%;
  max-width: 300px;
  padding: 12px 20px;
  margin-bottom: 20px;
  border: 2px solid #444;
  border-radius: 25px;
  font-size: 16px;
  background: #fff;
  color: #333;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.login-button {
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

.login-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(6, 93, 125);
  background: radial-gradient(circle, rgba(6, 93, 125, 1) 0%, rgba(4, 28, 76, 1) 100%);
  border-radius: 0 15px 15px 0;
}

.image {
  width: 50%;
  height: auto;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .input-field {
    max-width: 80%;
    font-size: 14px;
  }

  .login-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .image {
    width: 60%;
  }
}

@media (max-width: 480px) {
  .input-field {
    max-width: 90%;
    font-size: 12px;
  }

  .login-button {
    padding: 8px 16px;
    font-size: 12px;
  }

  .image {
    width: 70%;
  }
}
</style>

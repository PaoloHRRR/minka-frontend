<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',         // Variable para el correo electrónico
      password: '',      // Variable para la contraseña
      errorMessage: '',  // Variable para mensajes de error
    };
  },
  methods: {
    async handleSubmit() {

      try {
        const response = await axios.post('http://158.23.168.150/api/login.php', {
          email: this.email,
          password: this.password,
        });
        // Manejar la respuesta del servidor
        if (response.data.success) {
          alert('¡Bienvenido!');
          this.$router.push('/home');
          // Toma la informacion del usuario para guardarla en la session
          const userData = response.data.user;
          console.log(userData);
          sessionStorage.setItem('userRole', userData.role_id);
          sessionStorage.setItem('userName', userData.name);
          sessionStorage.setItem('userId', userData.id);
        } else {
          this.errorMessage = response.data.error || 'Credenciales incorrectas.';
        }
      } catch (error) {
        // Manejar errores de la solicitud
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango de 2xx
          this.errorMessage = error.response.data.error || 'Error en la conexión.';
          if (error.response.status === 400) {
            // Manejo específico para errores 400
            console.error('Error de entrada:', error.response.data.error);
          } else if (error.response.status === 401) {
            // Manejo específico para errores 401
            console.error('Acceso no autorizado:', error.response.data.error);
          } else if (error.response.status === 500) {
            // Manejo específico para errores 500
            console.error('Error del servidor:', error.response.data.error);
          }
        } else {
          // No se recibió respuesta del servidor
          this.errorMessage = 'Error en la conexión. Intenta de nuevo.';
          console.error(error);
        }
      }
    }
  },
};
</script>>

<template>
  <main>
    <img src="../assets/Blublu_Logo.png">
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input
              type="email"
              id="email"
              v-model="email"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
              type="password"
              id="password"
              v-model="password"
              required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </main>
</template>

<style scoped>
main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
img {
  max-width: 260px;
}
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: black;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
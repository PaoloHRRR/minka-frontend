<!-- src/components/LoginForm.vue -->
<template>
  <div class="login-container">
    <h2>{{ title }}</h2>
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
      <button type="submit">{{ submitButtonText }}</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'LoginForm',
  props: {
    title: {
      type: String,
      default: 'Iniciar Sesión'
    },
    submitButtonText: {
      type: String,
      default: 'Iniciar Sesión'
    }
  },
  emits: ['submit-success', 'submit-error'],
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const handleSubmit = async () => {
      try {
        // Emitir datos al componente padre
        emit('submit-success', { email: email.value, password: password.value });
        errorMessage.value = ''; // Limpiar el mensaje de error al enviar
      } catch (error) {
        errorMessage.value = 'Error al enviar el formulario';
        emit('submit-error', errorMessage.value);
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
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

<template>
  <div class="login-container">
    <h2>{{ title }}</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Campo de nombre -->
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input
            type="text"
            id="name"
            v-model="name"
            required
        />
      </div>

      <!-- Campo de correo electrónico -->
      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <input
            type="email"
            id="email"
            v-model="email"
            required
        />
      </div>

      <!-- Campo de contraseña -->
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input
            type="password"
            id="password"
            v-model="password"
            required
        />
        <small v-if="password && !isPasswordStrong" class="error">La contraseña debe contener al menos 8 caracteres, una letra mayúscula, un número y un símbolo.</small>
      </div>

      <!-- Campo de confirmación de contraseña -->
      <div class="form-group">
        <label for="confirmPassword">Confirmar Contraseña:</label>
        <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
        />
        <small v-if="confirmPassword && confirmPassword !== password" class="error">Las contraseñas no coinciden.</small>
      </div>

      <button type="submit" :disabled="!isFormValid">{{ submitButtonText }}</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'RegisterForm',
  props: {
    title: {
      type: String,
      default: 'Registrarse'
    },
    submitButtonText: {
      type: String,
      default: 'Registrarse'
    }
  },
  emits: ['submit-success', 'submit-error'],
  setup(props, { emit }) {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errorMessage = ref('');

    // Lógica de validación de la contraseña
    const isPasswordStrong = computed(() => {
      const passwordValue = password.value;
      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(passwordValue);
    });

    // Validar si el formulario es válido
    const isFormValid = computed(() => {
      return (
          name.value &&
          email.value &&
          isPasswordStrong.value &&
          password.value === confirmPassword.value
      );
    });

    const handleSubmit = async () => {
      try {
        // Emitir datos al componente padre
        emit('submit-success', { name: name.value, email: email.value, password: password.value });
        errorMessage.value = ''; // Limpiar el mensaje de error al enviar
      } catch (error) {
        errorMessage.value = 'Error al enviar el formulario';
        emit('submit-error', errorMessage.value);
      }
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      errorMessage,
      handleSubmit,
      isPasswordStrong,
      isFormValid,
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

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}

small {
  font-size: 0.8em;
}
</style>

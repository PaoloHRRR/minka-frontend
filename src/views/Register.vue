<template>
  <main>
    <MinkaLogoBig />
    <RegisterForm
        title="Crear Cuenta"
        submitButtonText="Registrarse"
        @submit-success="handleRegisterSuccess"
        @submit-error="handleRegisterError"
    />
  </main>
</template>

<script>
import RegisterForm from '../components/RegisterForm.vue';
import axios from 'axios';
import {apiBaseUrl} from "../apiConfig.js";
import MinkaLogoBig from "../components/MinkaLogoBig.vue";

export default {
  components: {
    MinkaLogoBig,
    RegisterForm
  },
  methods: {
    async handleRegisterSuccess(credentials) {
      try {
        const response = await axios.post(apiBaseUrl + '/user/register', {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          system_role: "user"
        });

        if (response.data.body.success) {
          alert('¡Cuenta creada exitosamente!');
          this.$router.push('/login');
        } else {
          this.handleRegisterError(response.data.body.error || 'Error al registrar la cuenta.');
        }
      } catch (error) {
        this.handleRegisterError(error.response.data.body.error);
      }
    },
    handleRegisterError(errorMessage) {
      console.error("Register error:" + errorMessage);
    }
  }
};
</script>

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
</style>

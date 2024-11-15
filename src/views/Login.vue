<!-- src/views/Login.vue -->
<template>
  <main>
    <MinkaLogoBig />
    <LoginForm
        title="Iniciar Sesión"
        submitButtonText="Iniciar Sesión"
        @submit-success="handleLoginSuccess"
        @submit-error="handleLoginError"
    />
    <div class="register-link">
      <p>¿No tienes cuenta? <router-link to="/register">Registrarse</router-link></p>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import LoginForm from "../components/LoginForm.vue";
import {apiBaseUrl} from "../apiConfig.js";
import MinkaLogoBig from "../components/MinkaLogoBig.vue";

export default {
  components: {
    MinkaLogoBig,
    LoginForm,
  },
  methods: {
    async handleLoginSuccess(credentials) {
      try {
        const response = await axios.post(apiBaseUrl + '/user/login', {
          email: credentials.email,
          password: credentials.password,
        });
        if (response.data.body.success) {
          alert('¡Bienvenido!');
          this.$router.push({ path: '/home', query: { ngod: 'all' } });

          const userData = response.data.body.data;
          sessionStorage.setItem('UserId', userData.id);
          sessionStorage.setItem('UserName', userData.name);
          sessionStorage.setItem('UserSystemRole', userData.system_role);
          sessionStorage.setItem('UserToken', userData.access_token);
        } else {
          this.handleLoginError(response.data.body.error || 'Credenciales incorrectas.');
        }
      } catch (error) {
        this.handleLoginError("Login error:" + error.response.data.body.error);
      }
    },
    handleLoginError(errorMessage) {
      console.error(errorMessage);
    },
  },
};
</script>

<style scoped>
main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
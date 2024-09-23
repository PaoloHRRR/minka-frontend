<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; {{ currentYear }} Blublu - Todos los derechos reservados</p>
      <nav>
        <router-link to="/about">Acerca de</router-link> |
        <router-link to="/privacy">Política de Privacidad</router-link>
      </nav>
    </div>
  </footer>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  setup() {
    const currentYear = ref(new Date().getFullYear());

    return {
      currentYear,
    };
  },
};
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  background-color: var(--brand-color);
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #e7e7e7;
  width: 100%;
}

.footer p {
  margin: 0;
  color: #ffffff;
}

.footer nav {
  margin-top: 10px;
}

.footer a {
  color: #ffffff;
  font-weight: bolder;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
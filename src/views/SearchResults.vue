<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import {apiBaseUrl} from "../apiConfig.js";

export default {
  created() {
    this.performSearch(this.$route.query.ngod || 'all'); // Valor por defecto si no hay query
  },
  name: "Search",
  components: {Navbar},
  methods: {
    searchNGOD(query) {
      console.log("Query recibido:", query);
      this.$router.push({ path: '/search', query: { ngod: query || 'all' } });
      this.performSearch(query)
    },
    async performSearch(ngod) {
      try {
        const endpoint = (ngod === 'all' || ngod === '') ? '/all' : `/search/${ngod}`;
        const url = `${apiBaseUrl}/ngod${endpoint}`;
        const response = await axios.get(url);
        this.ngods = response.data.body.data.ngods;
      } catch (error) {
        console.error("Error al cargar las ONGDs:", error);
      }
    }
  }
}
</script>

<template>
  <main>
    <Navbar @search="searchNGOD" />
  </main>
</template>

<style scoped>

</style>
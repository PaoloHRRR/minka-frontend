<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import NGODCard from "../components/NGODCard.vue";
import { apiBaseUrl } from "../apiConfig.js";

export default {
  name: "Search",
  components: {NGODCard, Navbar },
  data() {
    return {
      ngods: [], // Lista de ONGDs
      errorMessage: null, // Mensaje de error si algo falla
    };
  },
  created() {
    this.performSearch(this.$route.query.ngod || "all"); // Carga inicial
  },
  watch: {
    // Observa cambios en la ruta para realizar una nueva búsqueda
    "$route.query.ngod"(newQuery) {
      this.performSearch(newQuery || "all");
    },
  },
  methods: {
    searchNGOD(query) {
      console.log("Query recibido:", query);
      if (this.$route.query.ngod !== query) {
        this.$router.push({ path: "/search", query: { ngod: query || "all" } });
      }
    },
    async performSearch(ngod) {
      try {
        this.errorMessage = null; // Resetea el mensaje de error
        const endpoint = ngod === "all" ? "/all" : `/search/${ngod}`;
        const url = `${apiBaseUrl}/ngod${endpoint}`;
        const response = await axios.get(url);
        this.ngods = response.data.body.data.ngods;
        console.log("ONGDs cargadas:", this.ngods);
      } catch (error) {
        console.error("Error al cargar las ONGDs:", error);
        this.errorMessage = "No se pudieron cargar los resultados. Por favor, intenta de nuevo.";
      }
    },
  },
};
</script>

<template>
  <main>
    <Navbar @search="searchNGOD" />
    <div class="content">
      <h1>Resultados de la búsqueda</h1>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div v-else-if="ngods.length === 0" class="no-results">
        <p>No se encontraron ONGDs.</p>
      </div>
      <div v-else class="ngod-list">
        <NGODCard
            v-for="ngod in ngods"
            :key="ngod.id"
            :name="ngod.name"
            :profile-picture="ngod.profile_picture"
            :status="ngod.status"
            :description="ngod.description"
            :address="ngod.address"
            :registration-date="ngod.registration_date"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  margin-top: 73px;
  margin-bottom: 99px;
  padding-top: 15px;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-y: auto;
  height: calc(100vh - 172px);
}
.content {
  padding: 2rem;
}

.error-message {
  color: red;
  font-weight: bold;
}

.no-results {
  font-style: italic;
}

.ngod-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
</style>

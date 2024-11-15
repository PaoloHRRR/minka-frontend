<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import NGODCard from "../components/NGODCard.vue";
import { apiBaseUrl } from "../apiConfig.js";

export default {
  name: "Search",
  components: { NGODCard, Navbar },
  data() {
    return {
      ngods: [], // Lista de ONGDs
      errorMessage: null, // Mensaje de error si algo falla
      currentPage: 1, // Página actual
      totalNGODs: 0, // Total de ONGDs
      pageSize: 50, // ONGDs por página
    };
  },
  created() {
    this.performSearch(this.$route.query.ngod || "all", this.currentPage);
  },
  watch: {
    // Observa cambios en la ruta para realizar una nueva búsqueda
    "$route.query.ngod"(newQuery) {
      this.performSearch(newQuery || "all", 1); // Reinicia a la página 1
    },
  },
  methods: {
    searchNGOD(query) {
      if (this.$route.query.ngod !== query) {
        this.$router.push({path: "/search", query: {ngod: query || "all"}});
      }
    },
    async performSearch(ngod, page) {
      try {
        this.errorMessage = null; // Resetea el mensaje de error
        const endpoint = ngod === "all" ? "/all" : `/search/${ngod}`;
        const url = `${apiBaseUrl}/ngod${endpoint}?page=${page}&limit=${this.pageSize}`;
        const response = await axios.get(url);
        this.ngods = response.data.body.data.ngods;
        this.totalNGODs = response.data.body.data.total; // Total desde el backend
        this.currentPage = page;
      } catch (error) {
        console.error("Error al cargar las ONGDs:", error);
        this.errorMessage = "No se pudieron cargar los resultados. Por favor, intenta de nuevo.";
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.performSearch(this.$route.query.ngod || "all", page);
      }
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalNGODs / this.pageSize);
    },
  },
};
</script>

<template>
  <main>
    <Navbar @search="searchNGOD"/>
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

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
        >
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: var(--brand-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

main {
  margin-top: 73px;
  margin-bottom: 99px;
  padding-top: 15px;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-y: auto;
  height: calc(100vh - 172px);
}
</style>
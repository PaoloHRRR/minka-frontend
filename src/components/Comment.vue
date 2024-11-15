<template>
  <div class="comment">
    <div class="comment-header">
      <span class="comment-user">{{ username }}</span>
      <span class="comment-date">{{ formattedDate }}</span>
    </div>
    <p class="comment-content">{{ comment.content.description }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { apiBaseUrl } from "../apiConfig.js";

export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      username: "Cargando...", // Inicializamos con un mensaje de carga
    };
  },
  async created() {
    // Esperamos a que `getName` retorne el nombre y lo asignamos a `username`
    this.username = await this.getName(this.comment.user);
  },
  methods: {
    async getName(user_id) {
      try {
        const response = await axios.get(`${apiBaseUrl}/user-name/${user_id}`);
        return response.data.body.data.name;
      } catch (error) {
        const errorMsg = error.response?.data?.body?.error || "Error al cargar el nombre de usuario";
        this.handleUserLoadError(errorMsg);
        return "Usuario desconocido"; // Retornamos un valor por defecto en caso de error
      }
    },
    handleUserLoadError(errorMessage) {
      console.error(errorMessage);
    }
  },
  computed: {
    formattedDate() {
      // Puedes personalizar el formato de fecha aquí
      const date = new Date(this.comment.date);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }
};
</script>

<style scoped>
.comment {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #555;
}

.comment-user {
  font-weight: bold;
}

.comment-date {
  font-style: italic;
}

.comment-content {
  margin-top: 5px;
  color: #333;
}
</style>
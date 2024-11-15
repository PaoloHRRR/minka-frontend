<template>
  <img v-if="imageUrl" :src="imageUrl" alt="Imagen descargada" class="image-display" />
  <p v-else>Cargando imagen...</p>
</template>

<script>
import axios from "axios";
import { apiBaseUrl } from "../apiConfig.js";

export default {
  name: "ImageDisplay",
  props: {
    fileId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageUrl: null
    };
  },
  async created() {
    try {
      const response = await axios.get(`${apiBaseUrl}/file/download/${this.fileId}`);
      const { file_data_base64, content_type } = response.data;
      this.imageUrl = `data:${content_type};base64,${file_data_base64}`;
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
    }
  }
};
</script>

<style scoped>
.image-display {
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 1rem;
}
</style>

<template>
  <template v-if="fileUrl">
    <!-- Mostrar imagen si el archivo es una imagen -->
    <img v-if="isImage" :src="fileUrl" alt="Archivo visualizado" class="file-display-img" />

    <!-- Mostrar video si el archivo es un video -->
    <video v-else-if="isVideo" :src="fileUrl" controls class="file-display-vid"></video>

    <!-- Mostrar enlace de descarga si es otro tipo de archivo -->
    <a v-else :href="fileUrl" download :title="fileName" class="file-download">
      Descargar {{ fileName }}
    </a>
  </template>
  <p v-else>Cargando archivo...</p>
</template>

<script>
import axios from "axios";
import { apiBaseUrl } from "../apiConfig.js";

export default {
  name: "FileDisplay",
  props: {
    fileId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fileUrl: null,
      contentType: null,
      fileName: null
    };
  },
  async created() {
    try {
      // Obtener archivo desde la API
      const response = await axios.get(`${apiBaseUrl}/file/download/${this.fileId}`);
      const {file_data_base64, content_type, filename} = response.data;

      // Almacenar la URL de datos y la información del archivo
      this.fileUrl = `data:${content_type};base64,${file_data_base64}`;
      this.contentType = content_type;
      this.fileName = filename;
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
    }
  },
  computed: {
    // Computed property para verificar si el archivo es una imagen
    isImage() {
      return this.contentType && this.contentType.startsWith("image/");
    },
    // Computed property para verificar si el archivo es un video
    isVideo() {
      return this.contentType && this.contentType.startsWith("video/");
    }
  }
};
</script>

<style scoped>
.file-display-img {
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 1rem;
}

.file-download {
  display: inline-block;
  margin-top: 1rem;
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
}
</style>

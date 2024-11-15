<template>
  <template v-if="fileUrl">
    <img v-if="isImage" :src="fileUrl" alt="Archivo visualizado" class="file-display-img" />
    <video v-else-if="isVideo" :src="fileUrl" controls class="file-display-vid"></video>
    <pv-button
        v-else
        :icon="'pi pi-download'"
        :label="`Descargar Archivo (.${fileExtension})`"
        class="file-download-button"
        @click="downloadFile"
    />
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
  methods: {
    downloadFile() {
      const link = document.createElement("a");
      link.href = this.fileUrl;
      link.download = this.fileName;
      link.click();
    },
    extractExtension(filename) {
      const parts = filename.split(".");
      return parts.length > 1 ? parts[parts.length - 1] : "archivo"; // Si no hay extensión, se usa "archivo"
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
      const response = await axios.get(`${apiBaseUrl}/file/download/${this.fileId}`);
      const { file_data_base64, content_type, filename } = response.data;
      this.fileUrl = `data:${content_type};base64,${file_data_base64}`;
      this.contentType = content_type;
      this.fileName = filename;
      this.fileExtension = this.extractExtension(filename);
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
.file-display-vid {
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 1rem;
}
.file-download-button {
  margin-top: 1rem;
}
</style>

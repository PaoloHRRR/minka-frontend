<template>
  <pv-card class="post-card" @click="openModal">
    <template #title>{{ ngodName || publisher }}</template>
    <template #content>
      <p class="m-0">{{ description }}</p>
      <div v-if="files && files.length > 0" class="image-container">
        <ContentDisplay
            v-for="(file, index) in files.slice(0, 3)"
            :key="index"
            :fileId="file"
        />
      </div>
      <p v-else>No hay imagen disponible</p>
    </template>
  </pv-card>
</template>

<script>
import axios from "axios";
import {apiBaseUrl} from "../apiConfig.js";
import ContentDisplay from "./ContentDisplay.vue";

export default {
  components: {
    ContentDisplay
  },
  props: {
    publisher: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    files: {
      type: Array,
      required: false
    },
    comments: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      userRole: null,
      userId: null,
      ngodName: null,
    };
  },
  async created() {
    this.userRole = sessionStorage.getItem('UserSystemRole');
    this.userId = sessionStorage.getItem('UserId');
    this.ngodName = await this.getName(this.publisher);
  },
  methods: {
    async getName(ngod_id) {
      try {
        const response = await axios.get(`${apiBaseUrl}/ngod-name/${ngod_id}`);
        return response.data.body.data.name;
      } catch (error) {
        const errorMsg = error.response?.data?.body?.error || "Error al cargar el nombre de NGOD";
        this.handleNGODLoadError(errorMsg);
        return null;
      }
    },
    handleNGODLoadError(errorMessage) {
      console.error(errorMessage);
    },
    openModal() {
      this.$emit('show-modal', {
        publisher: this.ngodName || this.publisher,
        description: this.description,
        files: this.files,
        comments: this.comments
      });
    }
  },
  name: "PostCard",
};
</script>

<style scoped>
.post-card {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
  color: black;
  width: 60%;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-container {
  display: flex;
  gap: 8px;
  margin-top: 1rem;
}
</style>

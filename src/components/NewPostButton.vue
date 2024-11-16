<script>
import axios from "axios";

export default {
  created() {
    this.userRole = sessionStorage.getItem('UserSystemRole');
  },
  methods: {
    async NewPost() {
      try {
        const response = await axios.post('', {
          publisher: this.publisher,
          description: this.description,
          file: this.file,
        });
        if (response.data.success) {
          alert(response.data.success); // Muestra el mensaje de éxito
          location.reload();
        } else {
          alert(`Error: ${response.data.error}`);
        }
      } catch (error) {
        if (error.response) {
          alert('Error en la conexión al servidor: ' + (error.response.data.error || error.message));
        } else {
          alert('Error: ' + error.message);
        }
      }
    }
  },
  name: "NewPostButton",
};
</script>

<template>
  <pv-button
      label="Añadir publicación"
      size="large"
      style="margin-bottom: 20px;"
      v-if="userRole === 'admin'"
  />
</template>

<style scoped>

</style>
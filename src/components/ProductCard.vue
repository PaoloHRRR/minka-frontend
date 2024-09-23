<script>
import axios from "axios";

export default {
  data() {
    return {
      userRole: null,
      userId: null,
      productId: null,
    };
  },
  created() {
    this.userRole = sessionStorage.getItem('userRole');
    this.userId = sessionStorage.getItem('userId');
  },
  methods: {
    async buy() {
      try {
        const response = await axios.post('http://158.23.168.150/api/purchase2.php', {
          product_id: this.id,
          quantity: 1
        });

        // Manejo de la respuesta
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
  name: "ProductCard",
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: false,
    },
  },
};
</script>

<template>
  <pv-card class="product-card">
    <template #title>{{ name }}</template>
    <template #content>
      <p class="m-0">{{ description }}</p>
      <p><strong>Precio:</strong> {{ price }} USD</p>
      <p><strong>Stock:</strong> {{ stock }}</p>
      <pv-button
          label="Comprar producto"
          size="large"
          v-if="userRole === '1'"
          @click="buy"
      />
    </template>
  </pv-card>
</template>

<style scoped>
.product-card {
  background-color: #e5e5e6;
  padding: 1rem;
  border-radius: 10px;
}
</style>
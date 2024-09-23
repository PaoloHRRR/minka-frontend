<script>
import Navbar from "../components/Navbar.vue";
import ImageCarousel from "../components/ImageCarousel.vue";
import ProductCard from "../components/ProductCard.vue";
import axios from "axios";

export default {
  data() {
    return {
      userRole: null,
      userId: null,
      products: [],
      errorMessage: '',
    };
  },
  created() {
    this.userRole = sessionStorage.getItem('userRole');
    this.userId = sessionStorage.getItem('userId');
    this.loadProducts();
  },
  methods: {
    async loadProducts(searchQuery = '') { // Agregar parámetro de búsqueda
      try {
        let response;

        // Construir la URL de la consulta según el rol de usuario
        if (this.userRole === "2") {
          response = await axios.get('http://158.23.168.150/api/search.php', {
            params: { user_id: this.userId }
          });
        } else if (this.userRole === "1") {
          response = await axios.get('http://158.23.168.150/api/search.php', {
            params: { name: searchQuery }
          });
        }

        // Manejo de errores del servidor
        if (response.data.error) {
          this.errorMessage = response.data.error;
          alert('Error del servidor: ' + this.errorMessage); // Notificación de error
        } else {
          this.products = response.data; // Asignar productos
        }
      } catch (error) {
        // Manejo de errores de la petición Axios
        if (error.response) {
          this.errorMessage = error.response.data.error || 'Error en la conexión al servidor';
          this.products = [];
          alert('Error del servidor: ' + this.errorMessage); // Notificación de error
        } else if (error.request) {
          this.errorMessage = 'No se recibió respuesta del servidor';
          alert('Error de solicitud: ' + this.errorMessage); // Notificación de error
        } else {
          this.errorMessage = 'Error al configurar la solicitud: ' + error.message;
          alert('Error de configuración: ' + this.errorMessage); // Notificación de error
        }
      }
    }
  },
  name: "Home",
  components: {ProductCard, Navbar, ImageCarousel }
}
</script>

<template>
  <Navbar @search="loadProducts" />
  <main>
    <h1>Bienvenido a Blublu: los arándanos del Perú</h1>
    <ImageCarousel />

    <h2 v-if="userRole === '1'">Lista de productos</h2>
    <h2 v-if="userRole === '2'">Mis Productos</h2>

    <!---->
    <pv-button
        label="Añadir producto"
        size="large"
        style="margin-bottom: 20px;"
        v-if="userRole === '2'"
    />

    <div class="card-container">
      <ProductCard
          v-for="(product, index) in products"
          :key="index"
          :name="product.name"
          :description="product.description"
          :price=String(product.price)
          :stock=String(product.stock)
          :id="Number(product.id)"
      />
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
    overflow-y: auto; /* Permitir el scroll vertical */
    height: calc(100vh - 172px); /* Ajusta la altura según sea necesario */
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; /* Espacio entre las tarjetas */
    gap: 1rem; /* Separación entre las tarjetas */
  }

  .card-container > * {
    width: calc(50% - 0.5rem); /* Hace que las tarjetas ocupen el 50% del ancho con separación */
  }
</style>
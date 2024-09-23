<script>
import img1 from '../assets/home_placeholder/1.png';
import img2 from '../assets/home_placeholder/2.png';
import img3 from '../assets/home_placeholder/3.png';
import img4 from '../assets/home_placeholder/4.png';
import img5 from '../assets/home_placeholder/5.png';

export default {
  data() {
    return {
      currentIndex: 0, // Índice de la imagen actual
      images: [img1, img2, img3, img4, img5] // Arreglo de imágenes importadas
    };
  },
  methods: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }
};
</script>

<template>
  <div class="carousel-container">
    <!-- Botón para cambiar a la imagen anterior -->
    <button class="carousel-button" @click="prevImage">←</button>

    <!-- Imagen actual -->
    <img :src="images[currentIndex]" alt="Image Carousel" class="carousel-image" />

    <!-- Botón para cambiar a la imagen siguiente -->
    <button class="carousel-button" @click="nextImage">→</button>
  </div>
</template>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.carousel-image {
  max-width: 600px;
  max-height: 400px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.carousel-button {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  margin: 0 20px;
  border-radius: 50%;
}

.carousel-button:hover {
  background-color: #555;
}
</style>
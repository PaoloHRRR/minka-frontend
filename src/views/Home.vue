<script>
import Navbar from "../components/Navbar.vue";
import ImageCarousel from "../components/ImageCarousel.vue";
import PostCard from "../components/PostCard.vue";
import Dialog from 'primevue/dialog'; // Componente para el modal
import axios from "axios";
import NewPostButton from "../components/NewPostButton.vue";
import Comment from "../components/Comment.vue";
import ImageDisplay from "../components/ImageDisplay.vue"; // Importamos ImageDisplay
import { apiBaseUrl } from "../apiConfig.js";

export default {
  data() {
    return {
      userRole: null,
      userId: null,
      posts: [],
      errorMessage: '',
      visible: false,           // Controla la visibilidad del modal
      selectedPost: {
        id: '',
        publisher: '',
        description: '',
        files: [], // Suponiendo que esto contiene el array de file IDs
        comments: []
      }
    };
  },
  created() {
    this.userRole = sessionStorage.getItem('UserSystemRole');
    this.userId = sessionStorage.getItem('UserId');
    this.loadPosts();
  },
  methods: {
    async loadPosts(searchQuery = '') {
      try {
        const response = await axios.get(apiBaseUrl + '/post/all');
        this.posts = response.data.body.data.posts;
        console.log(this.posts);
      } catch (error) {
        this.handleError(error);
      }
    },
    showModal(post) {
      console.log("Post recibido:", post);
      this.selectedPost = { ...post };
      this.visible = true;
      console.log("Publicación seleccionada:", this.selectedPost);
    },
    handleError(error) {
      if (error.response) {
        this.errorMessage = error.response.data.error || 'Error en la conexión al servidor';
        this.posts = [];
        alert('Error del servidor: ' + this.errorMessage);
      } else if (error.request) {
        this.errorMessage = 'No se recibió respuesta del servidor';
        alert('Error de solicitud: ' + this.errorMessage);
      } else {
        this.errorMessage = 'Error al configurar la solicitud: ' + error.message;
        alert('Error de configuración: ' + this.errorMessage);
      }
    }
  },
  name: "Home",
  components: {
    Comment,
    NewPostButton,
    PostCard,
    Navbar,
    ImageCarousel,
    Dialog,
    ImageDisplay // Registramos el componente
  }
};
</script>

<template>
  <Navbar @search="loadPosts" />
  <main>
    <h1 v-if="userRole === 'user'">Lista de publicaciones</h1>
    <h1 v-if="userRole === 'admin'">Mis publicaciones</h1>

    <NewPostButton />

    <div class="card-container">
      <PostCard
          v-for="(post, index) in posts"
          :key="index"
          :identificador="post.id"
          :publisher="post.publisher"
          :description="post.content.description"
          :files="post.content.files"
          :comments="post.comments"
          @show-modal="showModal"
      />
    </div>

    <!-- Modal para mostrar detalles de la publicación -->
    <Dialog v-model:visible="visible" modal header="Detalle de la publicación" :style="{ width: '50rem' }">
      <div v-if="selectedPost.files && selectedPost.files.length > 0" class="image-container">
        <ImageDisplay
            v-for="(file, index) in selectedPost.files"
            :key="index"
            :fileId="file"
        />
      </div>

      <h3>{{ selectedPost.publisher }}</h3>
      <p>{{ selectedPost.description }}</p>
      <h4>Comentarios</h4>
      <div v-if="selectedPost.comments && selectedPost.comments.length">
        <Comment
            v-for="(comment, index) in selectedPost.comments"
            :key="index"
            :comment="comment"
        />
      </div>
      <p v-else>No hay comentarios aún</p>
    </Dialog>
  </main>
</template>

<style scoped>
main {
  margin-top: 73px;
  margin-bottom: 99px;
  padding-top: 15px;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-y: auto;
  height: calc(100vh - 172px);
}

.card-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-container > * {
  width: 100%;
}
</style>
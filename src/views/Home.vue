<script>
import Navbar from "../components/Navbar.vue";
import ImageCarousel from "../components/ImageCarousel.vue";
import PostCard from "../components/PostCard.vue";
import Dialog from 'primevue/dialog';
import axios from "axios";
import NewPostButton from "../components/NewPostButton.vue";
import Comment from "../components/Comment.vue";
import ContentDisplay from "../components/ContentDisplay.vue";
import { apiBaseUrl } from "../apiConfig.js";

export default {
  props: {
    ngodName: {
      type: String,
      default: 'all',
    },
  },
  data() {
    return {
      userRole: null,
      userId: null,
      userONGD: null,
      posts: [],
      errorMessage: '',
      visible: false,
      showCreateModal: false,
      selectedPost: {
        id: '',
        publisher: '',
        description: '',
        files: [],
        comments: []
      },
      newPost: {
        description: '',
        files: [],
        publisher: '', // El nombre o ID del publicador, dependiendo de cómo se gestiona en tu sistema
      }
    };
  },
  async created() {
    this.userRole = sessionStorage.getItem('UserSystemRole');
    this.userId = sessionStorage.getItem('UserId');
    this.userONGD = '672c74a263d95f28c7b94d97'; // ONGD
    await this.loadPosts(this.ngodName);
  },
  methods: {
    handleFileUpload(event) {
      this.newPost.files = Array.from(event.target.files);
    },
    async uploadFile(file) {
      try {

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${apiBaseUrl}/file/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data.body.success) {
          console.log('Archivo cargado correctamente:', response.data);
          return response.data.body.data.id;
        } else {
          console.error('Error al cargar el archivo:', response.data.error);
        }
      } catch (error) {
        console.error('Error al intentar cargar el archivo:', error);
        throw error;
      }
    },
    async loadPosts(NGOD = 'all') {
      try {
        const endpoint = (NGOD === 'all' || NGOD === '') ? '/all' : `/by-ngod-name/${NGOD}`;
        const url = `${apiBaseUrl}/post${endpoint}`;
        const response = await axios.get(url);
        if (NGOD === 'all') {
          this.posts = response.data.body.data.posts;
        } else {
          this.posts = response.data.body.data;
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    showModal(post) {
      this.selectedPost = {...post};
      this.visible = true;
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
    },
    moveToSearchView(query) {
      this.$router.push({path: '/search', query: {ngod: query || 'all'}});
    },
    openCreateModal() {
      this.showCreateModal = true;
      console.log(sessionStorage.getItem('ONGD_role.ONGD'));
    },
    async createPost() {
      try {
        const uploadedFileIds = []; // Array para almacenar los IDs retornados

        // Subir los archivos, si los hay, y recolectar sus IDs
        if (this.newPost.files.length > 0) {
          for (const file of this.newPost.files) {
            const fileId = await this.uploadFile(file); // Subir archivo y obtener el ID
            uploadedFileIds.push(fileId); // Guardar el ID en el array
          }
        }

        // Preparar el cuerpo del post
        const postPayload = {
          publisher: this.userONGD, // Obtener el ID del usuario del almacenamiento de sesión
          //publisher: '672d5190c76a172630c5e706',
          content: {
            description: this.newPost.description, // Descripción de la publicación
            files: uploadedFileIds, // Array de IDs de archivos subidos
          },
        };

        const response = await axios.post(`${apiBaseUrl}/post/new`, postPayload);

        if (response.data.body.success) {
          console.log("Publicación creada exitosamente:", response.data);
          this.showCreateModal = false; // Cierra el modal
          this.newPost = {description: '', files: []}; // Reiniciar el formulario
          this.loadPosts(); // Recargar las publicaciones
        } else {
          console.error("Error al crear la publicación:", response.data.error);
          this.errorMessage = "Hubo un error al crear la publicación.";
        }
      } catch (error) {
        console.error("Error al crear la publicación:", error);
        this.errorMessage = "Hubo un error al crear la publicación.";
      }
    },
  },
  name: "Home",
  components: {
    ContentDisplay,
    Comment,
    NewPostButton,
    PostCard,
    Navbar,
    ImageCarousel,
    Dialog,
  },
};
</script>

<template>
  <Navbar @search="moveToSearchView"/>
  <main>
    <h1 v-if="userRole === 'user'">Lista de publicaciones</h1>
    <h1 v-if="userRole === 'admin'">Mis publicaciones</h1>
    <NewPostButton @click="openCreateModal"/>
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
    <Dialog v-model:visible="visible" modal header="Detalle de la publicación" :style="{ width: '50rem' }">
      <h3>{{ selectedPost.publisher }}</h3>
      <div v-if="selectedPost.files && selectedPost.files.length > 0" class="image-container">
        <ContentDisplay
            v-for="(file, index) in selectedPost.files"
            :key="index"
            :fileId="file"
        />
      </div>
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
    <Dialog v-model:visible="showCreateModal" modal header="Crear Nueva Publicación" :style="{ width: '50rem' }">
      <div class="form-group">
        <label for="description" class="form-label">Descripción:</label>
        <textarea
            v-model="newPost.description"
            id="description"
            rows="4"
            class="form-textarea"
            placeholder="Escribe la descripción de la publicación..."
        />
      </div>

      <!-- Campo de archivo -->
      <div class="form-group">
        <label for="files" class="form-label">Archivos:</label>
        <input
            type="file"
            id="files"
            @change="handleFileUpload"
            multiple
        />
      </div>

      <div class="form-actions">
        <button @click="createPost" class="form-btn">Crear Publicación</button>
      </div>
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
  align-items: center;
  gap: 1rem;
  width: 100%;
}

button {
  margin-top: 10px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.form-textarea {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.3s;
}

.form-textarea:focus {
  border-color: #5c6bc0;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.form-btn {
  background-color: #5c6bc0;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.2s;
}

.form-btn:hover {
  background-color: #3f4a87;
  transform: translateY(-2px);
}

.form-btn:active {
  background-color: #3f4a87;
  transform: translateY(0);
}

.form-btn:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

.image-container {
  display: flex;
  gap: 8px;
  margin-top: 1rem;
}
</style>
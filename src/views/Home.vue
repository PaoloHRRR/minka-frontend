<script>
import Navbar from "../components/Navbar.vue";
import ImageCarousel from "../components/ImageCarousel.vue";
import PostCard from "../components/PostCard.vue";
import Dialog from 'primevue/dialog';
import axios from "axios";
import NewPostButton from "../components/NewPostButton.vue";
import Comment from "../components/Comment.vue";
import ImageDisplay from "../components/ContentDisplay.vue";
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
      posts: [],
      errorMessage: '',
      visible: false, // Modal de detalle de publicación
      showCreateModal: false, // Modal para crear una nueva publicación
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
    await this.loadPosts(this.ngodName);
  },
  methods: {
    async loadPosts(NGOD = 'all') {
      try {
        const endpoint = (NGOD === 'all' || NGOD === '') ? '/all' : `/by-ngod-name/${NGOD}`;
        const url = `${apiBaseUrl}/post${endpoint}`;
        const response = await axios.get(url);
        if(NGOD === 'all') {
          this.posts = response.data.body.data.posts;
        } else {
          this.posts = response.data.body.data;
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    showModal(post) {
      console.log("Post recibido:", post);
      this.selectedPost = { ...post };
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
      this.$router.push({ path: '/search', query: { ngod: query || 'all' } });
    },
    // Método para abrir el modal de creación de publicación
    openCreateModal() {
      this.showCreateModal = true;
    },
    // Método para crear la publicación
    async createPost() {
      if (!this.newPost.description || !this.newPost.publisher) {
        alert("Por favor, completa todos los campos antes de enviar.");
        return;
      }

      try {
        const url = `${apiBaseUrl}/post/new`; // Endpoint para creación de publicaciones
        const response = await axios.post(url, this.newPost);

        if (response.data.success) {
          this.showCreateModal = false; // Cierra el modal
          this.newPost = {
            description: '',
            files: [],
            publisher: '',
          }; // Resetea el formulario
          await this.loadPosts(); // Recarga las publicaciones
          alert("Publicación creada exitosamente.");
        } else {
          alert("Hubo un problema al crear la publicación. Intenta nuevamente.");
        }
      } catch (error) {
        console.error("Error al crear la publicación:", error);
        alert("Ocurrió un error al enviar la publicación.");
      }
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files) {
        this.newPost.files = Array.from(files);
      }
    },
    async createPost() {
  if (!this.newPost.description) {
    alert("Por favor, completa la descripción.");
    return;
  }

  if (this.newPost.files.length === 0) {
    alert("Por favor, selecciona al menos un archivo para subir.");
    return;
  }

  try {
    // Subir archivos a la colección `files`
    const filePromises = this.newPost.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file); // Agregar el archivo al FormData

          axios.post(`${apiBaseUrl}/file/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            resolve(response.data.fileId); // El servidor debe devolver el ID del archivo subido
          })
          .catch(error => {
            reject(error); // Error al subir el archivo
          });
        })
    );

    // Esperar a que todos los archivos se suban
    const fileIds = await Promise.all(filePromises);

    // Crear el post con las referencias a los archivos subidos
    const postPayload = {
      description: this.newPost.description,
      publisher: "72d5190c76a172630c5e707", // Publisher fijo
      files: fileIds, // IDs de los archivos subidos
    };

    // Verifica el contenido de la carga antes de enviarla
    console.log('Payload de la publicación:', postPayload);

    // Enviar el post al servidor
    const postResponse = await axios.post(`${apiBaseUrl}/post/new`, postPayload);

    if (postResponse.data.success) {
      this.showCreateModal = false; // Cierra el modal
      this.newPost = { description: '', files: [] }; // Resetea el formulario
      await this.loadPosts(); // Recarga las publicaciones
      alert("Publicación creada exitosamente.");
    } else {
      alert("Hubo un problema al crear la publicación. Intenta nuevamente.");
    }
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    alert("Ocurrió un error al enviar la publicación.");
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
    ImageDisplay,
  },
};
</script>

<template>
  <Navbar @search="moveToSearchView" />
  <main>
    <h1 v-if="userRole === 'user'">Lista de publicaciones</h1>
    <h1 v-if="userRole === 'admin'">Mis publicaciones</h1>

    <!-- Botón para abrir el modal de creación de publicación -->
    <NewPostButton @click="openCreateModal" />

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

    <!-- Modal para crear una nueva publicación -->
    <Dialog v-model:visible="showCreateModal" modal header="Crear Nueva Publicación" :style="{ width: '50rem' }">
    <div class="form-group">
      <label for="description" class="form-label">Descripción:</label>
      <textarea
        v-model="newPost.description"
        id="description"
        rows="4"
        class="form-textarea"
        placeholder="Escribe la descripción de la publicación..."
      ></textarea>
    </div>
    <div class="form-group">
      <label for="fileUpload" class="form-label">Archivos:</label>
      <input
        type="file"
        id="fileUpload"
        class="form-textarea"
        multiple
        @change="handleFileUpload"
        accept="image/*,video/*"
      />
      <small>Formatos permitidos: Imágenes, Videos.</small>
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
  gap: 1rem;
}

.card-container > * {
  width: 100%;
}

button {
  margin-top: 10px;
}

/* Estilos para el formulario dentro del modal */
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
</style>
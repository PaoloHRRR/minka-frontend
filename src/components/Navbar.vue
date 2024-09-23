<script>
export default {
  data() {
    return {
      userRole: null,
      userName: null,
      searchQuery: "", // Agregar esta propiedad
    };
  },
  created() {
    this.userRole = sessionStorage.getItem('userRole');
    this.userName = sessionStorage.getItem('userName');
  },
  methods: {
    search() {
      // Emitir el evento con la búsqueda
      this.$emit('search', this.searchQuery);
    },
    async logout() {
      alert('¡Hasta la próxima, ' + this.userName+ '!');
      this.$router.push('/login');
    }
  },
  name: 'Navbar',
};
</script>

<template>
  <header>
    <pv-toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem; background-color: var(--brand-color);" aria-label="nav">
      <template #start>
        <div class="flex items-center gap-2">
          <!-- Logo como enlace a Home -->
          <router-link to="/home" class="flex items-center" style="text-decoration: none;">
            <img src="../assets/Blublu_Mini.png" alt="Logo" style="height: 40px;" />
            <span>Blublu</span>
          </router-link>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar..."
              v-if="userRole === '1'"
              style="width: 400px;"
          />
          <pv-button label="Buscar" @click="search" v-if="userRole === '1'" style="margin-left: 10px"/>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <pv-button
              label="Logout"
              size="small"
              style="margin-right: 20px"
              @click="logout"
          />
        </div>
      </template>
    </pv-toolbar>
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  color: white;
  width: 100%;
  z-index: 1000;
}

header span {
  margin-left: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  height: 100%;
  color: #ffffff;
}

header input {
  margin-left: 10px;
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
}

header .flex {
  display: flex;
  align-items: center;
}
</style>

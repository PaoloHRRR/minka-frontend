<template>
  <div class="ongd-card">
    <!-- Imagen de perfil -->
    <div class="profile-picture">
      <img
          :src="profilePicture || defaultProfilePicture"
          alt="Imagen de perfil"
          class="profile-img"
      />
    </div>
    <!-- Información principal -->
    <div class="ongd-info">
      <h2 class="ongd-name">{{ name }}</h2>
      <p class="ongd-description">{{ description }}</p>
      <p class="ongd-status">
        Estado: <span :class="statusClass">{{ status }}</span>
      </p>
      <p class="ongd-address">
        Dirección: {{ addressText }}
      </p>
      <p class="ongd-date">
        Fecha de Registro: {{ formattedDate }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NGODCard",
  props: {
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    registrationDate: {
      type: String,
      required: true,
    },
  },
  computed: {
    defaultProfilePicture() {
      return "https://via.placeholder.com/150?text=Sin+Imagen"; // URL de imagen por defecto
    },
    statusClass() {
      return {
        active: "status-active",
        inactive: "status-inactive",
      }[this.status.toLowerCase()] || "status-unknown";
    },
    addressText() {
      const { streetAddress, district, province, department } = this.address;
      return `${streetAddress}, ${district}, ${province}, ${department}`;
    },
    formattedDate() {
      const date = new Date(this.registrationDate);
      return date.toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.ongd-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  width: 300px;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s;
}

.ongd-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-picture {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.ongd-info {
  text-align: left;
}

.ongd-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.ongd-description {
  margin-bottom: 0.5rem;
  color: #555;
}

.ongd-status {
  margin-bottom: 0.5rem;
}

.ongd-status .status-active {
  color: green;
  font-weight: bold;
}

.ongd-status .status-inactive {
  color: red;
  font-weight: bold;
}

.ongd-status .status-unknown {
  color: gray;
}

.ongd-address {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.ongd-date {
  font-size: 0.9rem;
  color: #555;
}
</style>

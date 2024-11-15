<template>
  <div class="comment">
    <div class="comment-header">
      <span class="comment-user">{{ comment.user }}</span>
      <span class="comment-date">{{ formattedDate }}</span>
    </div>
    <p class="comment-content">{{ comment.content.description }}</p>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      // Puedes personalizar el formato de fecha aquí
      const date = new Date(this.comment.date);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }
};
</script>

<style scoped>
.comment {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #555;
}

.comment-user {
  font-weight: bold;
}

.comment-date {
  font-style: italic;
}

.comment-content {
  margin-top: 5px;
  color: #333;
}
</style>
<template>
  <div class="user-view">
    <div class="header">
      <h2>👤 User Details</h2>
      <button class="btn-back" @click="router.push('/users')">← Back to Users</button>
    </div>

    <div v-if="loading" class="loading">Loading user details...</div>
    <div v-else-if="!user" class="error">User not found.</div>
    <div v-else class="details-card">
      <div class="detail-row">
        <strong>Full Name:</strong> <span>{{ user.full_name }}</span>
      </div>
      <div class="detail-row">
        <strong>Email:</strong> <span>{{ user.email }}</span>
      </div>
      <div class="detail-row">
        <strong>Username:</strong> <span>{{ user.username }}</span>
      </div>
      <div class="detail-row">
        <strong>Role:</strong>
        <span :class="roleClass(user.role)">{{ user.role }}</span>
      </div>
      <div class="detail-row">
        <strong>Created At:</strong>
        <span>{{ formatDate(user.creation) }}</span>
      </div>

      <div class="actions">
        <button class="btn-edit" @click="router.push(`/users/${user.name}/edit`)">Edit</button>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserAccountAPI } from "@/services/api";

const route = useRoute();
const router = useRouter();
const user = ref(null);
const loading = ref(true);

const loadUser = async () => {
  try {
    console.log('route.params.name',route.params)
    const res = await UserAccountAPI.getUserByName(route.params.id); // you’ll add this API method
    user.value = res.data.message.message || null;
     console.log(' res', res)
  } catch (err) {
    console.error("Failed to load user", err);
    user.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUser();
});

const roleClass = (role) => {
  if (role === "Admin") return "status-active";
  if (role === "Manager") return "status-inactive";
  return "status-left";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
};


</script>

<style scoped>
.user-view {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  font-family: "Segoe UI", sans-serif;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-back {
  background: #e5e7eb;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.btn-back:hover {
  background: #d1d5db;
}
.loading,
.error {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.1rem;
}
.details-card {
  background: white;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}
.detail-row {
  margin-bottom: 1rem;
}
.status-active {
  color: #10b981;
  font-weight: bold;
}
.status-inactive {
  color: #ef4444;
  font-weight: bold;
}
.status-left {
  color: #f59e0b;
  font-weight: bold;
}
.actions {
  margin-top: 1.5rem;
}
.btn-edit {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
}
.btn-edit:hover {
  background: #2563eb;
}
.btn-danger {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-danger:hover {
  background: #dc2626;
}
</style>

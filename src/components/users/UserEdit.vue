<template>
  <div class="edit-user">
    <h2> Edit User Accounts</h2>

    <form @submit.prevent="updateUser">
      <div class="form-group">
        <label>Full Name</label>
        <input v-model="form.full_name" type="text" placeholder="Enter full name" required />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="Enter email" required />
      </div>

      <div class="form-group">
        <label>Username</label>
        <input v-model="form.username" type="text" placeholder="Enter username" required />
      </div>

      <div class="form-group">
        <label>Role</label>
        <select v-model="form.role" required>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
      </div>

      <div class="actions">
        <button type="submit" class="btn-primary">Save</button>
        <button type="button" class="btn-secondary" @click="router.push('/users')">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserAccountAPI } from "@/services/api";

const route = useRoute();
const router = useRouter();
const form = ref({
  full_name: "",
  email: "",
  username: "",
  role: ""
});

// Load current user data
onMounted(async () => {
  try {
    const res = await UserAccountAPI.getUserByName(route.params.id);
    form.value = res.data.message.message;
  } catch (error) {
    console.error("Failed to load user:", error);
  }
});

// Update user
const updateUser = async () => {
  try {
   const updateReq =  await UserAccountAPI.edit_user({
      name: route.params.id,
      ...form.value
    });
   console.log('updateReq',updateReq)
    // router.push("/users");
  } catch (error) {
    console.log('error',error)
    console.error("Failed to update user:", error);
  }
};
</script>

<style scoped>
.edit-user {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", sans-serif;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>

<template>
  <div class="employee-list">
    <div class="header">
      <h2>👥 User Accounts</h2>
      <!-- <button class="btn-primary" @click="router.push('/users/create')">
        + Add New User
      </button> -->
      <button class="btn-primary" @click="router.push('/')">
        Dashboard
      </button>
    </div>

    <div class="filters">
      <div>
        <label for="roleFilter">Filter by Role: </label>
        <select v-model="roleFilter">
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.name">
            <td>{{ user.full_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span :class="roleClass(user.role)">{{ user.role }}</span>
            </td>
            <td>
              <button class="btn-sm" @click="viewUser(user)">View</button>
              <button class="btn-sm" @click="editUser(user)">Edit</button>
              <!-- Hint !!! -->
              <!-- Delete from employee  -->
              <!-- <button class="btn-sm btn-danger" @click="deleteUser(user)">Delete</button> -->
              <!-- Hint !!! -->
            </td>
          </tr>
          <tr v-if="!filteredUsers.length">
            <td colspan="5" style="text-align:center; padding:1rem;">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserAccountAPI } from "@/services/api";

const router = useRouter();
const users = ref([]);
const roleFilter = ref("");

// Load users from API
const loadUsers = async () => {
  try {
    const res = await UserAccountAPI.getAllUsers(); // ✅ fixed method name
    console.log("users", res.data);
    users.value = res.data.message || [];
  } catch (error) {
    console.error("Failed to load users:", error);
  }
};

onMounted(() => {
  loadUsers();
});

const filteredUsers = computed(() => {
  if (!roleFilter.value) return users.value;
  return users.value.filter((u) => u.role === roleFilter.value);
});

const roleClass = (role) => {
  if (role === "Admin") return "status-active";
  if (role === "Manager") return "status-inactive";
  return "status-left";
};

const viewUser = (user) => {
  router.push(`/users/${user.name}`);
};

const editUser = (user) => {
  router.push(`/users/${user.name}/edit`);
};

const deleteUser = async (user) => {
  if (confirm(`Delete user ${user.full_name}?`)) {
    console.log("Deleting user", user);
    //  Call delete API
  }
};
</script>

<style scoped>
.employee-list {
  max-width: 1380px;
  margin: auto;
  padding: 2rem;
  font-family: "Segoe UI", sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0;
  font-size: 1.75rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #2563eb;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.filters select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table thead {
  background-color: #f3f4f6;
}

.data-table th {
  font-weight: 600;
  color: #374151;
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

.btn-sm {
  padding: 0.35rem 0.6rem;
  font-size: 0.85rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 0.3rem;
  background-color: #e5e7eb;
  transition: background-color 0.2s;
}
.btn-sm:hover {
  background-color: #d1d5db;
}
.btn-danger {
  background-color: #ef4444;
  color: white;
}
.btn-danger:hover {
  background-color: #dc2626;
}
</style>

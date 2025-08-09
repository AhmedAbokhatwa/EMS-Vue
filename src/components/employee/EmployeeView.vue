<!-- components/employee/EmployeeView.vue -->
<template>
  <div class="employee-view">
    <h2>👤 Employee Details</h2>

    <div v-if="employee">
      <p><strong>Name:</strong> {{ employee.employee_name }}</p>
      <p><strong>Email:</strong> {{ employee.user_id }}</p>
      <p><strong>Mobile:</strong> {{ employee.custom_mobile }}</p>
      <p><strong>Address:</strong> {{ employee.current_address }}</p>
      <p><strong>Designation:</strong> {{ employee.designation }}</p>
      <p><strong>Status:</strong> 
        <span :class="statusClass(employee.custom_employee_status)">
          {{ employee.custom_employee_status }}
        </span>
      </p>
      <p><strong>Company:</strong> {{ employee.company }}</p>
      <p><strong>Department:</strong> {{ employee.department }}</p>
      <p v-if="employee.date_of_joining"><strong>Hired On:</strong> {{ employee.date_of_joining }}</p>
      <p v-if="employee.custom_days_employed"><strong>Days Employed:</strong> {{ employee.custom_days_employed }}</p>
    </div>

    <p v-else-if="error" class="error">{{ error }}</p>
    <p v-else>Loading...</p>

    <button @click="goBack" class="btn-primary">🔙 Back to List</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { employeeAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()

const employee = ref(null)
const error = ref('')

const fetchEmployee = async () => {
  try {
    const response = await employeeAPI.getById(route.params.id)
    if (response.status === 200) {
      employee.value = response.data.data
    } else {
      error.value = 'Employee not found'
    }
  } catch (err) {
    console.error('Error fetching employee:', err)
    error.value = 'Failed to load employee'
  }
}

const goBack = () => {
  router.push('/employees')
}

const statusClass = (status) => {
  return {
    'status-hired': status === 'Hired',
    'status-pending': status === 'Application Received',
    'status-interview': status === 'Interview Scheduled',
    'status-rejected': status === 'Not Accepted'
  }
}

onMounted(fetchEmployee)
</script>

<style scoped>
.employee-view {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.employee-view h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.employee-view p {
  margin: 0.6rem 0;
  font-size: 1.05rem;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

.btn-primary {
  margin-top: 1.5rem;
  background-color: #3b82f6;
  color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #2563eb;
}

.status-hired {
  color: #10b981;
  font-weight: bold;
}
.status-pending {
  color: #f59e0b;
  font-weight: bold;
}
.status-interview {
  color: #3b82f6;
  font-weight: bold;
}
.status-rejected {
  color: #ef4444;
  font-weight: bold;
}
</style>

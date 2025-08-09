<!-- components/employee/EmployeeEdit.vue -->
<template>
  <div class="employee-edit">
    <h2>✏️ Edit Employee</h2>

    <form v-if="employee" @submit.prevent="updateEmployee">
      <label>
        Name:
        <input v-model="employee.employee_name" required />
      </label>
        <label>
        Gender:
        <input v-model="employee.gender" required />
      </label>
      
      <label>
        Email:
        <input v-model="employee.user_id" type="email" required />
      </label>

      <label>
        Mobile:
        <input v-model="employee.custom_mobile" type="tel" required />
      </label>

      <label>
        Address:
        <input v-model="employee.current_address" />
      </label>

      <label>
        Designation:
        <input v-model="employee.designation" />
      </label>

      <label>
        Status:
        <select v-model="employee.custom_employee_status">
          <option>Application Received</option>
          <option>Interview Scheduled</option>
          <option>Hired</option>
          <option>Not Accepted</option>
        </select>
      </label>

      <label>
        Company:
        <select v-model="employee.company" disabled>
          <option :value="employee.company">{{ employee.company }}</option>
        </select>
      </label>

      <label>
        Department:
        <select v-model="employee.department">
          <option v-for="dept in departments" :key="dept.name" :value="dept.name">
            {{ dept.department_name }}
          </option>
        </select>
      </label>

      <label v-if="employee.date_of_joining">
        Hired On:
        <input v-model="employee.date_of_joining" type="date" />
      </label>

      <button type="submit" class="btn-primary"> Update</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
    <p v-else-if="!employee">Loading...</p>

    <button @click="goBack" class="btn-secondary"> Back To Employees</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { employeeAPI, departmentAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()

const employee = ref(null)
const departments = ref([])
const error = ref('')
const success = ref('')

const fetchEmployee = async () => {
  try {
    const response = await employeeAPI.getById(route.params.id)
    if (response.status === 200) {
      employee.value = response.data.data
      await fetchDepartments(employee.value.company)
    } else {
      error.value = 'Employee not found.'
    }
  } catch (err) {
    error.value = 'Failed to load employee data.'
  }
}

const fetchDepartments = async (companyName) => {
  try {
    const response = await departmentAPI.getDepartmentByCompany(companyName)
    departments.value = response.data.message
  } catch (err) {
    console.error('Error fetching departments:', err)
    error.value = 'Could not load departments.'
  }
}

const updateEmployee = async () => {
  try {
    console.log(employee.value)
    await employeeAPI.update(employee.value.name, employee.value)
    success.value = '✅ Employee updated successfully!'
  } catch (err) {
    console.error('Update failed:', err)
    error.value = '❌ Failed to update employee.'
  }
}

const goBack = () => {
  router.push('/employees')
}

onMounted(fetchEmployee)
</script>

<style scoped>
.employee-edit {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

input,
select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn-primary {
  background-color: #10b981;
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #059669;
}

.btn-secondary {
  margin-top: 1rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #2563eb;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

.success {
  color: green;
  text-align: center;
  margin-top: 1rem;
}
</style>

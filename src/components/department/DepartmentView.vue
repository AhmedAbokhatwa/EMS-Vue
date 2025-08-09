<template>
  <div class="department-view">
    <h2> Department Details</h2>

    <div v-if="department">
      <p><strong>Name:</strong> {{ department.name }}</p>
      <p><strong>Department Company:</strong> {{ department.company }}</p>
      <p><strong>Number of Employees :</strong> {{EmployeesNumber}}</p>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <button @click="goBack"> Back To Departments</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { departmentAPI, employeeAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const department = ref(null)
const EmployeesNumber = ref('')
const error = ref('')

const fetchDepartment = async () => {
  try {
    console.log('route.params', route.params.name);
    const departmentRes = await departmentAPI.getById(route.params.name)
    console.log('res',departmentRes)

    if (departmentRes.status === 200) {
      department.value = departmentRes.data.data
      const empNumbers = await employeeAPI.getAll({ department: route.params.name })

      if (empNumbers.status === 200) {
        const count = empNumbers.data.message.length
        EmployeesNumber.value = count > 0 ? count : `No Employees for ${route.params.name}`
      } else {
        error.value = 'Failed to get employees number'
      }
    } else {
      error.value = 'No department found'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Error: Failed to load department'
  }
}

const goBack = () => {
  router.push('/departments')
}

onMounted(fetchDepartment)
</script>

<style scoped>
.department-view {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  font-family: 'Segoe UI', Tahoma, sans-serif;
}

.department-view h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

.department-view p {
  margin: 0.75rem 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #444;
  padding: 0.5rem 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.department-view strong {
  color: #2c3e50;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  background: #ffe6e6;
  padding: 0.5rem;
  border-radius: 6px;
}

button {
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #4CAF50, #2e7d32);
  color: white;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
  display: block;
  margin-left: auto;
  margin-right: auto;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(76, 175, 80, 0.4);
}

</style>

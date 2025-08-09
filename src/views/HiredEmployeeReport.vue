<template>
  <div class="report-container">
    <h2>📋 Hired Employees Report</h2>

    <div v-if="loading" class="loading">Loading employees...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && employees.length === 0" class="no-data">
      No hired employees found.
    </div>

    <div v-if="employees.length > 0" class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Email Address</th>
            <th>Mobile Number</th>
            <th>Status</th>
            <th>Hired On</th>
            <th>Days Employed</th>
            <th>Company Name</th>
            <th>Department Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in employees" :key="emp.name">
            <td>{{ emp.employee_name }}</td>
            <td>{{ emp.custom_email }}</td>
            <td>{{ emp.custom_mobile || '-' }}</td>
            <td>{{ emp.custom_employee_status || '-' }}</td>
            <td>{{ emp.date_of_joining }}</td>
            <td>{{ emp.custom_days_employed }}</td>
            <td>{{ emp.company }}</td>
            <td>{{ emp.department }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { employeeAPI } from '@/services/api' 

const employees = ref([])
const loading = ref(true)
const error = ref('')

const loadEmployees = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await employeeAPI.getAll() 
    if (res.status === 200 && res.data.message) {
        let hiredEmployees =  res.data.message.filter(emp => emp.custom_employee_status === 'Hired')
   
      employees.value = hiredEmployees
    } else {
      error.value = 'Failed to load employee data.'
    }
  } catch (e) {
    error.value = 'Error loading employee data.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const daysEmployed = (hiredOn) => {
  if (!hiredOn) return '-'
  const startDate = new Date(hiredOn)
  const now = new Date()
  const diffTime = Math.abs(now - startDate)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + ' days'
}

onMounted(() => {
  loadEmployees()
})
</script>

<style scoped>
.report-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.loading,
.error,
.no-data {
  text-align: center;
  margin: 1rem 0;
  font-weight: 600;
  color: #ef4444;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.data-table thead {
  background-color: #f3f4f6;
}

.data-table th {
  font-weight: 600;
}
</style>

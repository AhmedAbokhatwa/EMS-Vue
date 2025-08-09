<!-- components/department/departmentEdit.vue -->
<template>
  <div class="department-edit">
    <h2> Edit Department 
    </h2>

    <form v-if="department" @submit.prevent="updateDepartment">
      
        <label>
            Department:
            <input v-model="department.department_name" required />
        </label>

      <label>
        Company:
        <select v-model="department.company" @change="loadCompanies">
          <option disabled value="">Select company</option>
          <option v-for="comp in companies" :key="comp.name" :value="comp.name">
            {{ comp.company_name }}
          </option>
        </select>
      </label>
        
        <label>
            Number Of Employees :
            <input v-model="department.custom_number_of_employees" disabled />
        </label>


      <button type="submit" class="btn-primary"> Update</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
    <p v-else-if="!department">Loading...</p>

    <button @click="goBack" class="btn-secondary"> Back To Departments</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { employeeAPI, departmentAPI ,companyAPI} from '@/services/api'

const route = useRoute()
const router = useRouter()

const department = ref(null)
const companies = ref([])
const error = ref('')
const success = ref('')

const fetchDepartment = async () => {
  try {
    
    const response = await departmentAPI.getById(route.params.name)
    if (response.status === 200) {
      department.value = response.data.data
     
    } else {
      error.value = 'department not found.'
    }
  } catch (err) {
    error.value = 'Failed to load department data.'
  }
}

const loadCompanies = async () => {
  try {
    const response = await companyAPI.getAll()
    companies.value = response.data.message
    console.log('companies.value',response)
  } catch (err) {
      console.log(err)
    error.value = '❌ Failed to load companies'
  }
}

const updateDepartment = async () => {
  try {
    console.log('department.value',department.value.name)
     console.log('department.value.name',department.value.name)

    await departmentAPI.update(department.value.name, department.value)
    success.value = '✅ Department updated successfully!'
  } catch (err) {
    console.error('Update failed:', err)
    error.value = '❌ Failed to update Department'
  }
}

const goBack = () => {
  router.push('/departments')
}

onMounted(()=>{
    loadCompanies();
    fetchDepartment();    
})
</script>

<style scoped>
.department-edit {
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

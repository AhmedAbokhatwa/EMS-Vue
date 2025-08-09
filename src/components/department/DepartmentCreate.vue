<template>
  <div class="department-create">
    <h2>➕ Create New Department</h2>

    <form @submit.prevent="createDepartment">
      <label>
        Department Name:
        <input
          v-model="department_name"
          :class="{ invalid: showErrors && !department_name }"
          placeholder="Enter department name"
        />
      </label>
      <p v-if="showErrors && !department_name" class="validation-error">
        Department name is required
      </p>

      <label>
        Company:
        <select
          v-model="company"
          :class="{ invalid: showErrors && !company }"
        >
          <option disabled value="">Select company</option>
          <option v-for="comp in companies" :key="comp.name" :value="comp.name">
            {{ comp.company_name }}
          </option>
        </select>
      </label>
      <p v-if="showErrors && !company" class="validation-error">
        Please select a company
      </p>

      <button type="submit" class="btn-primary">Create Department</button>
    </form>

    <p v-if="success" class="success-msg">{{ success }}</p>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { companyAPI, departmentAPI } from '@/services/api'

const router = useRouter()

const department_name = ref('')
const company = ref('')
const success = ref('')
const error = ref('')
const showErrors = ref(false)

const companies = ref([])

const loadCompanies = async () => {
  try {
    const response = await companyAPI.getAll()
    companies.value = response.data.message
  } catch (err) {
    error.value = '❌ Failed to load companies'
  }
}

onMounted(() => {
  loadCompanies()
})

const createDepartment = async () => {
  showErrors.value = false
  success.value = ''
  error.value = ''

  if (!department_name.value || !company.value) {
    showErrors.value = true
    return
  }

  try {
    const payload = {
      department_name: department_name.value,
      company: company.value
    }
    const depCreateRes = await departmentAPI.create(payload)
    if (depCreateRes.status === 200) {
      success.value = 'Department created successfully'
      department_name.value = ''
      company.value = ''
      setTimeout(() => router.push('/departments'), 1000)
    } else {
      throw new Error(depCreateRes._server_messages || 'Unknown error')
    }
  } catch (err) {
    if (err.status === 409) {
      error.value = err.response?.data?.message?.error || 'Duplicate entry error'
    } else {
      error.value = `Failed to create department: ${err.message || err}`
    }
  }
}
</script>

<style scoped>
.department-create {
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.department-create form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  flex-direction: column;
}

input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
  border-color: #3498db;
}

input.invalid,
select.invalid {
  border-color: #e74c3c;
  background-color: #fdecea;
}

.validation-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.success-msg {
  color: #2ecc71;
  font-weight: 700;
  margin-top: 1rem;
  text-align: center;
}

.error-msg {
  color: #e74c3c;
  font-weight: 700;
  margin-top: 1rem;
  text-align: center;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #2980b9;
}
</style>

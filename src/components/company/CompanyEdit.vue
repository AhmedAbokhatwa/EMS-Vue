<template>
  <div class="company-edit">
    <h2>✏️ Edit Company</h2>

    <form v-if="company" @submit.prevent="updateCompany">
      <div class="form-group">
        <label>Company Name</label>
        <input v-model="company.company_name" required />
      </div>

      <div class="form-group">
        <label>Number of Departments</label>
        <input v-model.number="company.custom_number_of_departments" disabled/>
      </div>

      <div class="form-group">
        <label>Number of Employees</label>
        <input v-model.number="company.custom_number_of_employees"  disabled />
      </div>

      <button type="submit"> Save Changes</button>
      <button type="button" @click="goBack"> Cancel</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { companyAPI } from '@/services/api'
const route = useRoute()
const router = useRouter()
const company = ref(null)
const error = ref('')

const fetchCompany = async () => {
  try {
    const res = await companyAPI.getById(route.params.name)
    console.log('rrrrrrr',res)
    const data = await res.data.data
    company.value = data
  } catch (err) {
    error.value = '❌ Failed to load company.'
  }
}

const updateCompany = async () => {
  error.value = ''
  try {
    const res = await companyAPI.update(route.params.name, {company_name: company.value.company_name});
    console.log('reaaas',res)
    if (res.status === 200) {
      router.push('/companies')
    } else {
      const data = await res.data
      error.value = data.data || '❌ Failed to update company.'
    }
  } catch (error){
    console.log(error)
    error.value = '❌ Network error while updating.'
  }
}

const goBack = () => {
  router.push('/companies')
}

onMounted(() => {
  fetchCompany()
})
</script>

<style scoped>
.company-edit {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
}

.company-edit h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  margin-right: 0.5rem;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>

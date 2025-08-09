<template>
  <div class="company-create">
    <h2>➕ Create New Company</h2>
    <form @submit.prevent="createCompany">
      <label>
        Company Name:
        <input 
          v-model="company.company_name" 
          type="text"
          required 
          placeholder="Enter company name"
        />
      </label>
      
      <label>
        Abbreviation:
        <input 
          v-model="company.abbr" 
          type="text"
          required 
          maxlength="5" 
          placeholder="Max 5 characters"
          @input="company.abbr = company.abbr.toUpperCase()"
        />
      </label>
      
      <label>
        Default Currency:
        <select v-model="company.default_currency" required>
          <option value="">Select Currency</option>
          <option value="USD">USD - US Dollar</option>
          <option value="SAR">SAR - Saudi Riyal</option>
          <option value="EGP">EGP - Egyptian Pound</option>
        </select>
      </label>
      
      <label>
        Country:
        <select v-model="company.country" required>
          <option value="">Select Country</option>
          <option value="Egypt">Egypt</option>
          <option value="Saudi Arabia">Saudi Arabia</option>
          <option value="United States">United States</option>
        </select>
      </label>
      
      <button 
        type="submit" 
        class="btn-primary" 
        :disabled="isLoading"
      >
        {{ isLoading ? 'Creating...' : 'Create Company' }}
      </button>
    </form>
    
    <div v-if="success" class="success-msg">
      ✅ {{ success }}
    </div>
    
    <div v-if="error" class="error-msg">
      ❌ {{ error }}
    </div>
  </div>
</template>

<script setup>
import { companyAPI } from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const company = ref({
  company_name: '',
  abbr: '',
  default_currency: '',
  country: ''
})

const success = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()

const createCompany = async () => {
  success.value = ''
  error.value = ''
  isLoading.value = true
  
  try {
    // Validate form data
    if (!company.value.company_name.trim()) {
      throw new Error('Company name is required')
    }
    
    if (!company.value.abbr.trim()) {
      throw new Error('Abbreviation is required')
    }
    
    if (company.value.abbr.length > 5) {
      throw new Error('Abbreviation must be 5 characters or less')
    }
    
    const payload = {
      company_name: company.value.company_name.trim(),
      abbr: company.value.abbr.trim().toUpperCase(),
      default_currency: company.value.default_currency,
      country: company.value.country
    }
    
    console.log('Sending payload:', payload)
    
    const response = await companyAPI.create(payload)
    console.log('Response:', response)

    if (response?.status !== 200) {
        const errorData = await response.data.message
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
        
    const data = await response.data.message
    
    if (response.status === 200 && data) {
        success.value = data.message

        company.value = {
            company_name: '',
            abbr: '',
            default_currency: '',
            country: ''
        }

      setTimeout(() => router.push('/companies'), 2000)

    } else {
      throw new Error(data._server_messages || "Unknown error occurred")
    }
    
  } catch (err) {
    console.error('Create company error:', err)
    error.value = err.message || 'Failed to create company'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.company-create {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.company-create h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.company-create form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.company-create label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: #555;
}

.company-create input,
.company-create select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 5px;
}

.company-create input:focus,
.company-create select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.success-msg {
  color: #28a745;
  background: #d4edda;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
  margin-top: 10px;
}

.error-msg {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  margin-top: 10px;
}
</style>    
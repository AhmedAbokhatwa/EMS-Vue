<template>
  <div class="employee-create">
    <h2>➕ Create New Employee</h2>

        <div class="div">
      <button @click="goBack('/employees')" class="btn-secondary">employees</button>
      <button @click="goBack('/')" class="refresh-btn">Dashboard</button>

    </div>
    <form @submit.prevent="createEmployee">
      <label>
        Name:
        <input v-model="employee.employee_name" required />
      </label>

      <label>
        First Name:
        <input v-model="employee.first_name" required />
      </label>

      <label>
         Gender:
         <select v-model="employee.gender">
          <option disabled value="">Select status</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </label>

      <label>
       Date Of Birth:
        <input v-model="employee.date_of_birth" type="Date" required />
      </label>

      <label>
        Email:
        <input v-model="employee.custom_email" type="email" required />
      </label>

      <label>
        Mobile:
        <input v-model="employee.custom_mobile" type="tel" required />
      </label>


      <label>
        Designation:
        <select  v-model="employee.designation" @change="loadDesignations">
            <option disabled value=""></option>
            <option v-for="designation in designations" 
            :key="designation.name"
            :value="designation.name">
             {{ designation.name }}
        </option>
        </select>
      </label>

      <label>
        Status:
        <select v-model="employee.employee_status">
          <option disabled value="">Select status</option>
          <option value="Application Received">Application Received</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Hired">Hired</option>
          <option value="Not Accepted">Not Accepted</option>
        </select>
      </label>

      <label>
        Company:
        <select v-model="employee.company" @change="loadDepartments">
          <option disabled value="">Select company</option>
          <option v-for="comp in companies" :key="comp.name" :value="comp.name">
            {{ comp.company_name }}
          </option>
        </select>
      </label>

      <label>
        Department:
        <select v-model="employee.department">
          <option disabled value="">Select department</option>
          <option v-for="dept in departments" :key="dept.name" :value="dept.name">
            {{ dept.department_name }}
          </option>
        </select>
        <span style="color: red;">please set company again if it's not work</span>
      </label>

      <label v-if="employee.employee_status === 'Hired'">
        Hired On:
        <input v-model="employee.date_of_joining" type="date" />
      </label>

      <label  >
        Role: 
        <select v-model="employee.custom_role">
            <option disabled value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
        </select>
      </label>
            <label class="full">
        Address:
        <input v-model="employee.current_address" />
      </label>

      <label for="" class="full">

        <button type="submit" class="btn-primary">✅ Create</button>
      </label>
    </form>
    
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    
  </div>
</template>

<script setup>
import { useToast } from 'vue-toast-notification'
import { watch } from 'vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { companyAPI, departmentAPI, employeeAPI,designationAPI, userAPI} from '@/services/api'
const toast = useToast()
const router = useRouter()
const companies = ref([])
const departments = ref([])
const designations = ref([])
const employee = ref({
  employee_name: '',
  first_name:'',
  gender:'',
  date_of_birth:'',
  date_of_joining:'',
  custom_email: '',
  custom_mobile: '',
  current_address: '',
  designation: '',
  employee_status: '',
  company: '',
  department: '',
  custom_role: ''
 
})

const error = ref('')
const success = ref('')

const loadCompanies = async () => {
  try {
    const response = await companyAPI.getAll()
    companies.value = response.data.message
  } catch (err) {
    error.value = '❌ Failed to load companies'
  }
}

const loadDepartments = async () => {
  if (!employee.value.company) return
  try {
    const response = await departmentAPI.getDepartmentByCompany(employee.value.company)
    departments.value = response.data.message
  } catch (err) {
    error.value = '❌ Failed to load departments'
  }
}
const loadDesignations = async () => {
    try{
        const designRequest = await designationAPI.getAll();
        designations.value = designRequest.data.message
    }
    catch(error){

    }
}
const createEmployee = async () => {
  if (!validateEmail(employee.value.custom_email)) {
    toast.warning('Invalid Email')
    error.value = ' Invalid Email';
    return
  }

  if (!validateMobile(employee.value.custom_mobile)) {
       toast.warning('Invalid Mobile Number')
    error.value = 'Invalid mobile number';
    return
  }
  try {
    const useData = {
        email: employee.value.custom_email,
        first_name: employee.value.first_name,
        role: employee.value.custom_role
        }
      const userRequest = await userAPI.create(useData)
      // After Create User Success

      if (userRequest.status === 200 ){
          const payload = { ...employee.value }
          payload.user_id = payload.custom_email 
          
          await employeeAPI.create(payload)

          toast.success('Employee created successfully')
          success.value = 'Employee created successfully'
          error.value = ''
          setTimeout(() => {
          success.value = ''
          }, 7000) 
          localStorage.removeItem('draft_employee') 
          // Reset form
          employee.value = {
              employee_name: '',
              first_name:'',
              gender:'',
              date_of_birth:'',
              date_of_joining:'',
              custom_email: '',
              custom_mobile: '',
              current_address: '',
              designation: '',
              employee_status: '',
              company: '',
              department: '',
              custom_role: ''
          }

      }
  } catch (err) {
    if (err.response.data.exception
    .split(':')[0]
    .split(':')[0]
    .split('.')[2] === 'MandatoryError') {
      const parts = err.response.data.exception.split(':');
      const lastPart = parts[parts.length - 1];
      console.log('lastPart', lastPart);
      toast.warning(`${lastPart} id Mandatory Failed`)
      error.value = `${lastPart} id Mandatory Failed`;
    }else{
      console.log('type',err.response.data.exception
      .split(':')[0]
      .split(':')[0]
      .split('.')[2])
      toast.warning(err.response.data.exception.split(':')[1])
      error.value = err.response.data.exception.split(':')[1];
    }
    
  }
}

const goBack = (path) => {
  router.push(path)
}

onMounted(() => {
  loadCompanies();
  loadDesignations();
  const draft = localStorage.getItem('draft_employee')
  if (draft) {
    employee.value = JSON.parse(draft)
  }
})
watch(employee, (newVal) => {
  localStorage.setItem('draft_employee', JSON.stringify(newVal))
}, { deep: true })

const validateEmail = (email) => {
  // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

const validateMobile = (mobile) => {
  const regex = /^01[0125]{1}[0-9]{8}$/ 
  return regex.test(mobile)
}


</script>
<style scoped>
.employee-create {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2563eb;
  font-size: 1.8rem;
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
  color: #374151;
}

input,
select {
  padding: 0.7rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;
}

input:focus,
select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  outline: none;
}

.btn-primary {
  background: linear-gradient(90deg, #10b981, #059669);
  color: white;
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
  margin-top: 1rem;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.error {
  color: #dc2626;
  text-align: center;
  font-weight: 500;
}

.success {
  color: #16a34a;
  text-align: center;
  font-weight: 500;
}
/* 2 columns form layout */
form {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 fields per row */
  gap: 1rem 1.25rem; /* row-gap, column-gap */
  align-items: start;
}

/* each label is a grid item */
label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #374151;
}

/* make inputs/selects full width of their label */
input, select, textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: box-shadow .18s, border-color .18s;
}

/* special full-width field (span both columns) */
label.full {
  grid-column: 1 / -1; /* span all columns */
}

/* place submit and back buttons in full row and center them */
.btn-row {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.75rem;
  justify-content: center; /* center buttons */
  margin-top: 0.25rem;
}

/* responsive: single column on small screens */
@media (max-width: 720px) {
  form {
    grid-template-columns: 1fr;
  }

  .btn-row {
    flex-direction: column;
  }
}

/* focus style */
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
}

/* small polish for labels and headings */
.employee-create {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  font-family: 'Segoe UI', Tahoma, sans-serif;
}

h2 { text-align:center; color:#2563eb; margin-bottom:1.25rem; }
.error{ color:#dc2626; text-align:center; margin-top:0.5rem; }
.success{ color:#16a34a; text-align:center; margin-top:0.5rem; }
.div {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.refresh-btn {
  margin-top: 1rem;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(76, 175, 80, 0.4);
}

</style>

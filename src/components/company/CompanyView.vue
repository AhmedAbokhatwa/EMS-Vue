<template>
  <div class="company-view">
    <h2>📄 Company Details</h2>

    <div v-if="company">
    
      <p><strong>Company Name:</strong> {{ company.company_name }}</p>
      <div class="div">
        <button @click="fetchCompanies" class="refresh-btn">🔄 Refresh</button>
        <button @click="goTo('/')" class="refresh-btn">Dashboard</button>
      </div>
      <hr>
      <p>
        <strong>Departments of {{ company.company_name }}</strong> 
      </p>
        <table class="data-table">
          <thead>
            <tr>
              <th>Department Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in departments" :key="department.name" >
              <td>{{department.name}}</td>
            </tr>
          </tbody>
        </table>

     

      <div v-if="employees.length">

        <h3>👥 Employees Table </h3>
         <p><strong>Employees Count:</strong> {{ employees.length }}</p>
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Status</th>
               <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in employees" :key="emp.name">
              <td>{{ emp.employee_name }}</td>
              <td>{{ emp.designation }}</td>
              <td>{{ emp.status }}</td>
              <td>{{emp.department}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
    
    <p v-if="companyError" class="error">{{ companyError }}</p>
    <p v-if="departmentError" class="error">{{ departmentError }}</p>
    <p v-if="employeeError" class="error">{{ employeeError }}</p>


   
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { employeeAPI, companyAPI, departmentAPI } from '@/services/api'
const route = useRoute()
const router = useRouter()

const company = ref(null)
const departments = ref([])
const employees = ref([])
const companyError = ref('')
const departmentError = ref('')
const employeeError = ref('')


const fetchCompany = async () => {
  try {
    const response =  await companyAPI.getById(route.params.name)
    company.value = response.data.data 

   if (response.status === 200 && response.data?.data) {
      company.value = response.data.data
      await fetchDepartments(company.value.name)
      
      await fetchEmployees({ company: company.value.name})
    } else {
      companyError.value = 'Company not found'
    }
    
  } catch (err) {
    companyError.value = 'Failed to load company'
  }
}

const fetchDepartments = async (companyName)=>{
  try{
        const deptResponse = await departmentAPI.getDepartmentByCompany(company.value.name)
        if (deptResponse.status === 200){

          departments.value = deptResponse.data.message
          console.log('departments',  departments.value )
        }
        else{
          error.value = `Departments Not Found for This Company`;
        }

      } catch (deptError) {
    
        departmentError.value = `There are Error In Load Departments`;
      }
   

}

const fetchEmployees = async (filters) => {
    try{
      const empResponse = await employeeAPI.getAll(filters);
      employees.value = empResponse.data.message
      console.log('employees',  employees.value )
    }
    catch(employeeError)
    {
      employeeError.value= 'Failed to load employees.';
    }

}

const goTo = (path) =>{
  router.push(path);
}
onMounted(() => {
  fetchCompany()
})
</script>

<style scoped>
.company-view {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", Tahoma, sans-serif;
}

.company-view h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2563eb;
}

.company-view h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.company-view p {
  margin: 0.5rem 0;
  font-size: 1.05rem;
  color: #374151;
}

hr {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

button {
  display: inline-block;
  background-color: #2563eb;
  color: #fff;
  padding: 0.6rem 1.2rem;
  margin-top: 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #1e40af;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.data-table thead {
  background-color: #f3f4f6;
}

.data-table th,
.data-table td {
  padding: 0.85rem 1rem;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  font-weight: 600;
  color: #374151;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.error {
  margin-top: 1rem;
  color: #dc2626;
  text-align: center;
  font-weight: bold;
}
.div {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}
</style>

 <template>
  <div class="company-list">
    <h2>Company List</h2>
    <div class="div">
      <button @click="fetchCompanies" class="refresh-btn">🔄 Refresh</button>
      <button @click="goTo('/')" class="refresh-btn">Dashboard</button>
      <button @click="$router.push('/companies/create')" class="btn-primary">
        Add Company
      </button>
      
    </div>

    <table v-if="companies.length" class="company-table">
      <thead>
        <tr>
          <th style="width: 25%;">Company Name </th>
          <th>Number Of Departments</th>
          <th>Number Of Employees </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in companies" :key="company.name">
          <td>{{ company.company_name }}</td>
          <td>{{ company.custom_number_of_departments }}</td>
          <td>{{ company.custom_number_of_employees }}</td>
          <td>
            <div class="buttons">
              <button @click="viewCompany(company.name)">View</button>
              <button @click="editCompany(company.name)">Edit</button>
              <button @click="confirmDelete(company.name)">Delete</button>

            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No companies found.</p>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { departmentAPI,companyAPI  } from '@/services/api'
import {useToast} from 'vue-toast-notification';


const toast = useToast();
const companies = ref([])
const error = ref('')
const router = useRouter()

// API Get All
const fetchCompanies = async () => {
  error.value = ''
  try {
  
    const res = await companyAPI.getAll();
    if (res.status = 200){
      const data = res?.data;
      toast.success(" Company Fetch successfully!");
      companies.value = data.message
      console.log('data',data.message)
    }else{
      error.value = 'No Comanies Found'
    }
} catch (err) {
    error.value = 'Failed to load companies.'
}
}
// API Delete
const confirmDelete = async (name) => {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return
  try {
    const res = await companyAPI.delete(name);
    console.log('resDelete',res)
    if (res.status === 200) {
      companies.value = companies.value.filter(c => c.name !== name)
    } else {
      const data = await res.data.message
      error.value = data.message || 'Failed to delete company.'
    }
  } catch (err){
    console.log(err)
    error.value = 'Network error while deleting.'
  }
}
const viewCompany = (name) => {
  router.push(`/company/view/${name}`)
}

const editCompany = (name) => {
  router.push(`/company/edit/${name}`)
}
const goTo = (path) =>{
  router.push(path);
}
onMounted(() => {
  fetchCompanies()
})
</script>
<style scoped>
.company-list {
  max-width: 1300px;
  margin: auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  font-family: 'Segoe UI', Tahoma, sans-serif;
}

.company-list h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.div {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.refresh-btn {
  background: linear-gradient(135deg, #4CAF50, #2e7d32);
  color: white;
  padding: 0.55rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(76, 175, 80, 0.4);
}

.company-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
}

.company-table th {
  background: linear-gradient(115deg, #00cc66, #00994d);
  color: #fff;
  text-align: center;
  padding: 1rem;
  font-weight: 600;
  font-size: 1rem;
}

.company-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f1f1;
  font-size: 0.95rem;
  color: #444;
}

.company-table tbody tr {
  transition: background 0.25s ease;
}

.company-table tbody tr:hover {
  background-color: #f7fdf9;
}

.company-table button {
  border: none;
  padding: 0.45rem 0.85rem;
  margin-right: 0.4rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;
}

.company-table button:nth-child(1) {
  background: #3498db;
  color: #fff;
}

.company-table button:nth-child(1):hover {
  background: #2980b9;
}

.company-table button:nth-child(2) {
  background: #f1c40f;
  color: #fff;
}

.company-table button:nth-child(2):hover {
  background: #d4ac0d;
}

.company-table button:nth-child(3) {
  background: #e74c3c;
  color: #fff;
}

.company-table button:nth-child(3):hover {
  background: #c0392b;
}

.error {
  color: red;
  margin-top: 1.2rem;
  text-align: center;
  font-weight: 600;
  background: #ffe6e6;
  padding: 0.5rem;
  border-radius: 6px;
}
.buttons {
  display: flex;
  justify-content: center;
  align-items: center;   
  gap: 0.5rem;            
}
</style>

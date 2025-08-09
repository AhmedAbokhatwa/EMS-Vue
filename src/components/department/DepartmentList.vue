<!-- DepartmentList.vue -->
 <template>
  <div class="department-list">
    <h2>Department List</h2>
    
    <div class="filters">
      <button @click="fetchDepartments" class="refresh-btn"> Refresh Departments</button>
      <button @click="goTo('/')" class="refresh-btn">Go To Dashboard</button>
      <select v-model="selectedCompany" @change="loadEmployees">
        <option value="">All Companies</option>
        <option v-for="company in companies" :key="company.name" :value="company.name">
          {{ company.company_name }}
        </option>
      </select>
      <button @click="$router.push('/departments/create')" class="refresh-btn">
      Add Department
    </button>
    </div>
    <table v-if="departments.length" class="department-table">
      <thead>
        <tr>
          <th>Department Name</th>
           <th>Company</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template  v-for="department in departments" :key="department.name">
            <tr v-if="department.company">
              <td>{{ department.department_name }}</td>
               <td>{{ department.company }}</td>
              <td>
                <button @click="viewDepartment(department.name)">View</button>
                <button @click="editDepartment(department.name)">Edit</button>
                <button @click="confirmDelete(department.name)">Delete</button>
              </td>
            </tr>
        </template>
      </tbody>
    </table>

    <p v-else>No departments found.</p>

    <p v-if="error" class="error">{{ error }}</p>
  

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { departmentAPI,companyAPI  } from '@/services/api'
import { useToast } from 'vue-toast-notification'
const departments = ref([])
const error = ref('')
const router = useRouter()
const selectedCompany =ref('')
const companies = ref([])
const loading = ref(false);
const toast = useToast();
const viewDepartment = (name) => {
  router.push(`/department/view/${name}`)
}
const editDepartment = (name) => {
  router.push(`/department/edit/${name}`)
}
const goTo = (path) =>{
  router.push(path);
}
const loadCompanies = async ()=>{
  try {
    const response = await companyAPI.getAll()
    console.log('response',response)
    companies.value = response.data.message
  } catch (error) {
    console.error('Error loading companies:', error)
  }
}
const loadEmployees = async () => {
  try {
    loading.value = true
    const filters = selectedCompany.value ? { company:  selectedCompany.value } : {}
    console.log('filters',filters?.company)
    const response = await departmentAPI.getDepartmentByCompany(filters?.company)
    console.log('response',response)
    departments.value = response.data.message
  } catch (error) {
    console.error('Error loading employees:', error)
  } finally {
    loading.value = false
  }
}

// API fetchDepartments
const fetchDepartments = async () => {
  error.value = ''
  try {
      const filters = selectedCompany.value ? { company: selectedCompany.value } : {}
      const depRes = await departmentAPI.getDepartmentByCompany(filters?.company);
      if (depRes.status === 200){
        departments.value = depRes.data.message
      }
      console.log('departments', departments.value)
  } catch (err) {
      error.value = 'Failed to Fetch departments.'
  }
}

// API Delete Department
  const confirmDelete = async (name) => {
    try{
        const removeReq = await departmentAPI.remove_department_from_company(name)
        console.log('name',name)
        if (removeReq.status === 200){
          try {      
              const deleteResq = await departmentAPI.delete(name);

              console.log('deleteResq',deleteResq)
              if (deleteResq.status === 200) {
                toast.info(deleteResq.data.message.message)
                departments.value = departments.value.filter(c => c.name !== name)
              } else {
                const data = await deleteResq.json()
                 toast.warning(`Failed To Delete Department ${name}`)
                 error.value = data.message || 'Failed to delete Department.'
              }

          } catch (error){
        
            if (error.status === 417){
              toast.warning(error.response.data.exception.split(':')[1])
            }
              const serverMessage = error.response?.data?._server_messages;
              const parsed = JSON.parse(serverMessage)[0];
              const detailed = JSON.parse(parsed);
              if (detailed && detailed.message.includes('is linked with Employee')) {
                 toast.warning(' There is an Employee linked with this Department.');
              } else {
                error.value = ` ${detailed || 'Unknown error occurred.'}`;
              }
          }
        }
      }
    catch (error){
      console.log('error',error)
      toast.warning('Error Delete while Remove Department');
      error.value = 'Error Delete while Remove Department.'
    }

  }

onMounted(() => {
  fetchDepartments()
  loadCompanies();
  loadEmployees();
})
</script>

<style scoped>
.department-list {
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  font-family: 'Segoe UI', Tahoma, sans-serif;
}

.department-list h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.filters {
  display: flex;
  justify-content: flex-start; /* or space-between if you want them far apart */
  align-items: center;
  gap: 1rem; /* space between Refresh and filter dropdown */
  margin-bottom: 1.5rem;
  justify-content: space-between;
}

.filters .refresh-btn {
  margin: 0; /* remove extra spacing */
}

.filters select {
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.3s ease;
}

.filters select:focus {
  border-color: #3498db;
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

.department-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
}

.department-table th {
  background: linear-gradient(135deg, #00cc66, #00994d);
  color: #fff;
  text-align: center;
  padding: 1rem;
  font-weight: 600;
  font-size: 1rem;
}

.department-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f1f1;
  font-size: 0.95rem;
  color: #444;
  text-align: center;
}

.department-table tbody tr {
  transition: background 0.25s ease;
}

.department-table tbody tr:hover {
  background-color: #f7fdf9;
}

.department-table button {
  border: none;
  padding: 0.45rem 0.85rem;
  margin-right: 0.4rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;
}

.department-table button:nth-child(1) {
  background: #3498db;
  color: #fff;
}

.department-table button:nth-child(1):hover {
  background: #2980b9;
}

.department-table button:nth-child(2) {
  background: #f1c40f;
  color: #fff;
}

.department-table button:nth-child(2):hover {
  background: #d4ac0d;
}

.department-table button:nth-child(3) {
  background: #e74c3c;
  color: #fff;
}

.department-table button:nth-child(3):hover {
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

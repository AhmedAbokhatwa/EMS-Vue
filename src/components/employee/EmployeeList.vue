<template>
  <div class="employee-list">
    <div class="header">
      <h2>Employees</h2>
      <button @click="$router.push('/employees/create')" class="btn-primary">
        Add Employee
      </button>
    </div>
    
    <div class="filters">
       <button @click="$router.push('/')" class="btn-primary">
        Dashboard
       </button>
      <select v-model="selectedCompany" @change="loadEmployees">
        <option value="">All Companies</option>
        <option v-for="company in companies" :key="company.name" :value="company.name">
          {{ company.company_name }}
        </option>
      </select>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.name">
            <td>{{ employee.employee_name }}</td>
            <td>{{ employee.user_id }}</td>
            <td>{{ employee.custom_mobile }}</td>
            <td>{{ employee.designation }}</td>
            <td>
              <span :class="statusClass(employee.employee_status)">
                {{ employee.custom_employee_status }}
              </span>
            </td>
            <td>{{ employee.company }}</td>
            <td>
              <button @click="viewEmployee(employee.name)" class="btn-sm">View</button>
              <button @click="editEmployee(employee.name)" class="btn-sm">Edit</button>
              <button @click="deleteEmployee(employee.name)" class="btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { employeeAPI, companyAPI , roleAPI} from '@/services/api'

export default {
  name: 'EmployeeList',
  data() {
    return {
      employees: [],
      companies: [],
      selectedCompany: '',
      loading: false
    }
  },
  async mounted() {
    await this.loadCompanies()
    await this.loadEmployees()
  },
  methods: {
    async loadCompanies() {
      try {
        const response = await companyAPI.getAll()
        this.companies = response.data.message
      } catch (error) {
        console.error('Error loading companies:', error)
      }
    },
    async loadEmployees() {
      try {
        this.loading = true
        const filters = this.selectedCompany ? { company: this.selectedCompany } : {}
        const response = await employeeAPI.getAll(filters)
        this.employees = response.data.message
        console.log('employeesemployees',response.data.message)
      } catch (error) {
        console.error('Error loading employees:', error)
      } finally {
        this.loading = false
      }
    },
    statusClass(status) {
      return {
        'status-hired': status === 'Hired',
        'status-pending': status === 'Application Received',
        'status-interview': status === 'Interview Scheduled',
        'status-rejected': status === 'Not Accepted'
      }
    },
    viewEmployee(id) {
      this.$router.push(`/employees/${id}`)
    },
    editEmployee(id) {
      
      this.$router.push(`/employees/${id}/edit`)
    },
    // async deleteEmployee(id) {
    //   if (confirm('Are you sure you want to delete this employee?')) {
    //     try {
    //       await employeeAPI.delete(id)
    //        alert("Employee deleted successfully")
    //       await this.loadEmployees()
    //     } catch (error) {
    //       const serverMsg = error.response?.data.exception
    //       if (serverMsg) {
    //         const messagesplited = serverMsg?.split(':')[1];
    //         console.log('message splited',messagesplited)

    //         if (messagesplited?.includes('is linked with User Permission')){
    //          const delPerms =  confirm('Do you Want to Delete User Permission?');
    //          if (delPerms){
    //            const emp = await employeeAPI.getById(id);
    //            const email = emp.data.data.custom_email;
    //            try {
    //              const res = await roleAPI.delete(email);
    //              console.log("Permissions deleted:", res.data.message);

    //            } catch (e) {
    //              console.error("❌ Failed to delete user permissions:", e.response?.data || e);
    //              alert("❌ Failed to delete user permissions");
    //            }
    //          }
            

    //         }else{
    //         alert(`❌ Delete failed: ${messagesplited}`)
    //         }
    //       } else {
    //         alert("❌ Delete failed: Unknown error")
    //       }
          
    //     }
    //   }
    // }
        async deleteEmployee(id) {
     
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
            const emp = await employeeAPI.getById(id);
            const email = emp.data.data.custom_email;
              try {
                const res = await roleAPI.delete(email);
                console.log("Permissions deleted:", res.data.message);

                try {
                    const delEmp = await employeeAPI.delete(id)
                    console.log('delEmp',delEmp,id)
                    alert("Employee deleted successfully")
                    await this.loadEmployees()
                } catch (error) {
                  console.error(" Failed to delete Employee:", error);
                }
              } catch (e) {
                console.error(" Failed to delete user permissions:", e.response?.data || e);

              }
          } catch (error) {
            console.error(" Failed to Find Email :",error);
          }
        }
    }
  }
}
</script>
<style>
.employee-list {
  max-width: 1380px;
  margin: auto;
  padding: 2rem;
  font-family: "Segoe UI", sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0;
  font-size: 1.75rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #2563eb;
}

.filters {
  display: flex;
    align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.filters select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table thead {
  background-color: #f3f4f6;
}

.data-table th {
  font-weight: 600;
  color: #374151;
}

.status-active {
  color: #10b981;
  font-weight: bold;
}
.status-inactive {
  color: #ef4444;
  font-weight: bold;
}
.status-left {
  color: #f59e0b;
  font-weight: bold;
}

.btn-sm {
  padding: 0.35rem 0.6rem;
  font-size: 0.85rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 0.3rem;
  background-color: #e5e7eb;
  transition: background-color 0.2s;
}
.btn-sm:hover {
  background-color: #d1d5db;
}
.btn-danger {
  background-color: #ef4444;
  color: white;
}
.btn-danger:hover {
  background-color: #dc2626;
}

</style>
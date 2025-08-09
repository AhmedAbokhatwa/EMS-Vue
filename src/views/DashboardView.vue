<template>
  <div class="dashboard">
    <div class="header">
      <h1>📊 Welcome to Your Dashboard</h1>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <div class="stats">
      <div class="card" @click="goTo('/companies')">
        <h2>Companies</h2>
        <p>{{ stats.companies }}</p>
      </div>

      <div class="card" @click="goTo('/departments')">
        <h2>Departments</h2>
        <p>{{ stats.departments }}</p>
      </div>

      <div class="card" @click="goTo('/employees')">
        <h2>Employees</h2>
        <p>{{ stats.employees }}</p>
      </div>

      <div class="card" @click="goTo('/users')">
        <h2>User Accounts</h2>
        <p>{{ stats.users }}</p>
      </div>

      <div class="card" @click="goTo('/hiredemployeereport')">
        <h2>Hired Employee Report</h2>
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { companyAPI, departmentAPI, employeeAPI, authAPI, UserAccountAPI } from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
  companies: 0,
  departments: 0,
  employees: 0,
  users: 0
})

const goTo = (path) => {
  router.push(path)
}

const loadStats = async () => {
  try {
    const [companiesRes, departmentsRes, employeesRes, usersRes] = await Promise.all([
      companyAPI.getAll(),
      departmentAPI.getDepartmentByCompany({}),
      employeeAPI.getAll(),
      UserAccountAPI.getAllUsers()
    ])

    stats.value = {
      companies: companiesRes.data.message?.length || 0,
      departments: departmentsRes.data.message?.length || 0,
      employees: employeesRes.data.message?.length || 0,
      users: usersRes.data.message?.length || 0
    }
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  }
}

const logout = async () => {
  try {
    await authAPI.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>
<style scoped>
.dashboard {
  padding: 2.5rem 3rem;
  text-align: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #fafafa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 1rem;
}

.header h1 {
  font-weight: 700;
  font-size: 2.2rem;
  color: #1e293b;
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: white;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  box-shadow: 0 6px 18px rgba(185, 28, 28, 0.5);
}

.stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.75rem;
  margin-top: 1rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.card {
  background: linear-gradient(145deg, #ffffff, #e6e9f0);
  border-radius: 14px;
  padding: 2rem 1.8rem;
  width: 220px;
  box-shadow:
    3px 3px 8px #c8d0e7,
    -3px -3px 8px #ffffff;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow:
    5px 8px 16px #b0bbd9,
    -5px -5px 16px #f0f4ff;
  background: linear-gradient(145deg, #f5f7ff, #dde2f1);
}

.card h2 {
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  color: #334155;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.card p {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  user-select: text;
}
</style>

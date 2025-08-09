
import router from '@/router'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getCsrfToken = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/method/employee_management_system.employee_management.middleware.get_csrf_token`, {
      credentials: 'include'
    })
    const data = await response.json()
    const sid = data?.message?.message
    if (!sid) throw new Error('sid not found')
    return sid
  } catch (error) {
    console.error('Error getting CSRF token:', error)
    return null
  }
}

export const authAPI = {
  login: async (credentials) => {
    const csrfToken = await getCsrfToken()
   
    if (!csrfToken) throw new Error('CSRF token not found')


    const res = await fetch(`${API_BASE}/api/method/employee_management_system.employee_management.middleware.authenticated_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify({
        name: credentials.email,
        password: credentials.password
      })
    })

    const result = await res.json()

    if (result?.message?.sid) {
      document.cookie = `sid=${result.message.sid}; path=/; SameSite=None; Secure`
    }

    return result
  },

  logout: async () => {
    localStorage.clear()
    router.push('/login')
  }

}

// API companyAPI
export const companyAPI = {
  getAll: () => api.get('/api/method/employee_management_system.employee_management.api.get_companies'),

  getById: (id) => api.get(`/api/resource/Company/${id}`),
  create: (data) => api.post('/api/method/employee_management_system.employee_management.api.create_company', data),
  update: (id, data) => api.put(`/api/resource/Company/${id}`, data),

  delete: (company) => api.delete('/api/method/employee_management_system.employee_management.api.delete_company',{  data: { company }  })
}

// API departmentAPI
export const departmentAPI = {
  getDepartmentByCompany: (companyName) => api.get('/api/method/employee_management_system.employee_management.api.get_departments',
  {params:{company:companyName}}),

    getById: (id) => {
      const url = `/api/resource/Department/${encodeURIComponent(id)}`
      console.log('Requesting URL:', url)
      return api.get(url)
    },

  create: (data) => api.post('/api/method/employee_management_system.employee_management.api.create_department',data),

  update: (id, data) => api.put(`/api/resource/Department/${id}`, data),

  delete:(department_name) =>api.delete('/api/method/employee_management_system.employee_management.api.delete_department',{data:{department_name}}),

  remove_department_from_company: (department) =>
      api.post('/api/method/employee_management_system.employee_management.api.remove_department_from_company', { 
          department: department
      }),

}
export const employeeAPI = {
  getAll: (filters) => api.get('/api/method/employee_management_system.employee_management.api.get_employees', { filters }),
  getById: (id) => api.get(`/api/resource/Employee/${id}`,{ withCredentials: true }),
  update: (id, data) => api.put(`/api/resource/Employee/${id}`, data),
  create: (data) => api.post('/api/method/employee_management_system.employee_management.api.create_employee', data),
  delete: (employee_name) => api.delete('/api/method/employee_management_system.employee_management.api.delete_employee',{  data: { employee_name }  })
  
}

export const designationAPI ={
  getAll: () => api.get('/api/method/employee_management_system.employee_management.api.get_designation')
} 

export const userAPI ={
  // it create user with Role (Admin-Manager-Employee)
  create: (data) => api.post('/api/method/employee_management_system.employee_management.api.create_user',data)
} 
 

export const roleAPI = {
  delete: (email) => api.delete('/api/method/employee_management_system.employee_management.utils.delete_user_permission',{  data: { email }  }),
}


// API UserAccount
export const UserAccountAPI ={
    getAllUsers (){
      return api.get(
        "/api/method/employee_management_system.employee_management.middleware.get_all_users"

    );
  },
  getUserByName(name) {
  return api.get(`/api/method/employee_management_system.employee_management.middleware.get_user?name=${name}`);
  },

  edit_user(data){
    return api.post(`/api/method/employee_management_system.employee_management.middleware.edit_user`, data);
  },
  deleteUser(name) {
    return api.post(`/api/method/employee_management_system.employee_management.middleware.delete_user`, { name });
  }
}
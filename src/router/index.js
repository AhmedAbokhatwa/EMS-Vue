import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import DashboardView from '@/views/DashboardView.vue'

import CompanyList from '@/components/company/CompanyList.vue'
import CompanyView from '@/components/company/CompanyView.vue'
import CompanyEdit from '@/components/company/CompanyEdit.vue'
import CompanyCreate from '@/components/company/CompanyCreate.vue'


import DepartmentList from '@/components/department/DepartmentList.vue'
import DepartmentView from '@/components/department/DepartmentView.vue'
import DepartmentEdit from '@/components/department/DepartmentEdit.vue'
import DepartmentCreate from '@/components/department/DepartmentCreate.vue'

import EmployeeList from '@/components/employee/EmployeeList.vue'
import EmployeeEdit from '@/components/employee/EmployeeEdit.vue'
import EmployeeView from '@/components/employee/EmployeeView.vue'
import EmployeeCreate from '@/components/employee/EmployeeCreate.vue'

import UserList from '@/components/users/UserList.vue'
import UserView from '@/components/users/UserView.vue'
import UserEdit from '@/components/users/UserEdit.vue'

import NotAuthorized from '@/views/NotAuthorized.vue'

import HiredEmployeeReport from '@/views/HiredEmployeeReport.vue'
const routes = [
  {
    path: '/not-authorized',name: 'NotAuthorized', component: NotAuthorized
  },

  { path: '/', component: DashboardView, 
    meta: { requiresAuth: true,roles: ['admin', 'manager', 'employee'] } },

  { path: '/login', component: Login },
    // Report
  { path: '/hiredemployeereport', component: HiredEmployeeReport, 
    meta: { requiresAuth: true,roles: ['admin', 'manager', 'employee'] } },
  // companies
  { path: '/companies',name: 'Companies', component: CompanyList ,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},
  { path: '/company/view/:name', component: CompanyView ,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},
  { path: '/company/edit/:name', component: CompanyEdit ,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},
  { path: '/companies/create',  component: CompanyCreate, 
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},
    
  // departments
  { path:'/departments',component:DepartmentList ,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},

  { path: '/department/view/:name', component: DepartmentView,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},

  { path: '/department/edit/:name', component: DepartmentEdit,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},

  { path: '/departments/create', component: DepartmentCreate,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},

  // employees
  { path: '/employees', component: EmployeeList, 
    meta: { requiresAuth: true ,roles:['admin', 'manager', 'employee']} },

  { path: '/employees/:id', component: EmployeeView,
    meta: { requiresAuth: true ,roles:['admin', 'manager', 'employee']}},

  { path: '/employees/:id/edit',component: EmployeeEdit,
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},

  { path: '/employees/create', component: EmployeeCreate, 
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},

  { path: '/users', component: UserList, 
    meta: { requiresAuth: true ,roles:['admin', 'manager']}},

  { path: '/users/:id', component: UserView,
  meta: { requiresAuth: true ,roles:['admin', 'manager']}},  

  { path: '/users/:id/edit', component: UserEdit,
  meta: { requiresAuth: true ,roles:['admin', 'manager']}},  
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  let userRole = null;
  const sid = localStorage.getItem('auth_sid');
  const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);
      userRole = userData?.role || null;
    } catch (error) {
      console.error("Invalid JSON in localStorage for 'user_data'", error);
    }
  }
  
 
  

  if (to.meta.requiresAuth && !sid) {
    next('/login')
  } 
  if (to.meta.roles && (!userRole || !to.meta.roles.includes(userRole.toLowerCase()))) {

    return next('/not-authorized');
  }
  else {
    next()
  }
})

export default router
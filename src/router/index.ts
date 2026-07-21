import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '../pages/IndexPage.vue'
import CreateEmployeePage from '../pages/CreateEmployeePage.vue'
import EmployeeProfilePage from '../pages/EmployeeProfilePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
    },
    {
      path: '/employees/new',
      name: 'employee-create',
      component: CreateEmployeePage,
    },
    {
      path: '/employees/:code',
      name: 'employee-view',
      component: EmployeeProfilePage,
    },
    {
      path: '/employees/:code/edit',
      name: 'employee-edit',
      component: EmployeeProfilePage,
    },
  ],
})

export default router

import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import('./components/authen/Login.vue')
  },
  {
    path: '/logout',
    component: () => import('./components/authen/Logout.vue')
  },
  {
    path: '/resetPassword',
    component: () => import('./components/authen/ResetPassword.vue')
  },
  {
    path: '/changePassword/:token',
    component: () => import('./components/authen/ChangePassword.vue')
  },
  {
    path: '/',
    component: () => import('./components/Default.vue')
  },
  {
    path: '/home',
    component: () => import('./components/Home.vue')
  },
  {
    path: '/profile',
    component: () => import('./components/Profile.vue')
  },
  {
    path: '/userAccount',
    name: 'userAccount',
    component: () => import('./components/userAccount/Index.vue')
  },
  {
    path: '/userAccount/create',
    component: () => import('./components/userAccount/Create.vue')
  },
  {
    path: '/userAccount/:id/',
    component: () => import('./components/userAccount/Detail.vue')
  },
  {
    path: '/userAccount/edit/:id/',
    component: () => import('./components/userAccount/Edit.vue')
  },
  {
    path: '/userAccount/delete/:id/',
    component: () => import('./components/userAccount/Delete.vue')
  },
  {
    path: '/:path(.*)',
    component: () => import('./components/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'
import LoginForm from '../components/LoginForm.vue'
import HomePage from '../components/HomePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/register', component: RegisterForm },
  { path: '/login', component: LoginForm },
  {
  path: '/hotel/:id',
  name: 'HotelDetail',
  component: () => import('../components/HotelDetailPage.vue')
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

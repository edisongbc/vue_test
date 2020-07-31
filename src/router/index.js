import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 主页路由
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home')
  },
  // About路由
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About')
  },
  // Demo路由
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('../views/Demo')
  },
  // Zjca路由
  {
    path: '/zjca',
    name: 'Zjca',
    component: () => import('../views/Zjca')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

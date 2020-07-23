import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 主页路由
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  // About路由
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  // Demo路由
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('../views/Demo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

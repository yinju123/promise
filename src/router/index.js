import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: () => import("@views/index")
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior: (to, from, savePosition) => {
  }
})

export default router
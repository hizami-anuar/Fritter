import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ErrorPage from '../views/ErrorPage.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Freets',
    component: Home
  },
  {
    path: '/*',
    name: 'Error',
    component: ErrorPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

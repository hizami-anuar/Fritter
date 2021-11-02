import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import ErrorPage from '../views/ErrorPage.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/explore',
    name: 'Freets',
    component: Home
  },
  {
    path: "/profile/:username?",
    name: "Profile",
    component: Profile,
    props: true,
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

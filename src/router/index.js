import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Profile from '../views/Profile.vue'
import Nonexistent from '../views/Nonexistent.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore
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
    component: Nonexistent
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

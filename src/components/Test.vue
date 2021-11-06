<template>
    <div class="dropdown-menu">
    <transition name="fade" apear>
        <div class="sub-menu" v-if="isOpen">
            <div 
                v-for="user in users" 
                :key="user">
                <router-link :to="{ name: 'Profile', params: { username: user }}">{{ user }}</router-link>
            </div>
        </div>
    </transition>
    </div>
</template>

<script>
export default {
  name: 'services',
  props: ['users'],
  data () {
    return {
      isOpen: true,
      }
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.NavBar-searchBar:focus + .dropdown-menu {
    opacity: 1;
}

.dropdown-menu {
    position: relative;
    transition: opacity 0.5s ease-out;
    opacity: 0;
}

.sub-menu {
  position: absolute;
  background-color: $light-red;
  left: 45px;
  width: 250px;
  border-radius: 0px 0px 16px 16px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .5s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.sub-menu {
  cursor: pointer;
}
</style>
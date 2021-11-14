<template>
  <div class="dropdown-menu">
    <transition name="fade" appear>
      <div class="sub-menu" v-if="isOpen">
        <router-link 
          v-for="user in users" 
          @click.native="changeVisibility(false)"
          :key="user"
          :to="{ name: 'Profile', params: { username: user }}"
          tag="div"
          class="dropdown-item">
          {{ user }}
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import { eventBus } from '../main'
export default {
  name: 'SearchDropdown',
  props: ['users'],
  data () {
    return {
      isOpen: false,
    }
  },
  mounted: function() {
    eventBus.$on('show-dropdown', () => {
      this.changeVisibility(true);
    })

    eventBus.$on('hide-dropdown', () => {
      this.changeVisibility(false);
    })
  },
  methods: {
    changeVisibility (visibility) {
      this.isOpen = visibility
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.dropdown-menu {
  position: relative;
  transition: opacity 0.5s ease-out;
}

.dropdown-item {
  display: flex;
  align-items: center;
  font-size: 20px;
  height: 30px;
  padding: 5px 20px 5px 20px;
  width: 100%;
  outline: 1px solid black;
  color: black;
  font-family: 'Rowdies', Courier, monospace;
  text-decoration: none;
}
.dropdown-item:hover {
  background-color: $light-purple;
}
.sub-menu {
  position: absolute;
  z-index: 2;
  background-color: $light-red;
  left: 45px;
  width: 250px;
  border-radius: 0px 0px 16px 16px;
  overflow: hidden;
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
<template>
  <div class="dropdown-menu">
    <button @click="toggleOpen">HI</button>
    <transition name="fade" appear>
      <div class="sub-menu" v-if="isOpen">
        <div @click="showSettings"> 
          Settings 
        </div>
        <div @click="logout"> 
          Logout 
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";

export default {
  name: 'SearchDropdown',
  components: {},
  props: ['users'],
  data () {
    return {
      isOpen: false,
    }
  },
  methods: {
    logout() {
      axios.delete("/api/session")
      .then((response) => {
        eventBus.$emit("user-logout-success", {
            username: response.username, 
            userID: response.userID
        })
      })
      .catch((error) => {
        alert(error.response.data.message);
      })

      this.toggleOpen();
    },
    showSettings() {
      eventBus.$emit('show-settings');
      this.toggleOpen();
    },
    toggleOpen() {
      this.isOpen = !this.isOpen
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
  display: flex;
  flex-direction: column;
  left: auto;
  right: 0;
  margin-right: -10px;
  z-index: 2;
  background-color: var(--red);
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
<template>
  <div class="dropdown-menu">
    <span class="user-icon" @click="toggleOpen">
      {{ this.user.username[0].toUpperCase() }}
    </span>
    <transition name="fade" appear>
      <div class="sub-menu" v-if="isOpen">
        <div @click="showSettings" class="dropdownItem"> 
          <img src="../assets/settings.svg" class="icon"/>
          Settings 
        </div>
        <div @click="logout" class="dropdownItem"> 
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
  name: 'PersonalDropdown',
  components: {},
  props: ['user'],
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

.user-icon {
  color: var(--purple);
  font-size: 20px;
  font-family: 'Rowdies', Courier, monospace;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  margin: 0 5px 0 0;
}

.user-icon:hover {
  background-color: var(--light-blue);
  cursor: pointer
}

.dropdown-menu {
  position: relative;
  transition: opacity 0.5s ease-out;
}

.sub-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: auto;
  right: 0;
  margin: 15px -10px 0 0;
  z-index: 2;
  background-color: var(--red);
  color:white;
  font-size: 20px;
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

.icon {
  width: 20px;
  height: 20px;
  margin: 0px 2px 0px 2px;
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(234deg) brightness(107%) contrast(102%);
}

.dropdownItem {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}
</style>
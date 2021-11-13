<template>
  <div class="delete-user">
    <button class="delete-button" v-on:click="deleteUser">Delete My Account</button>
  </div>
</template>

<script>

import axios from "axios";
import { eventBus } from "../main";

export default {
  name: 'DeleteUser',
  methods: {
    deleteUser() {
      if (confirm('Are you sure you want to delete your account? All your freets will be deleted too.')) {
        axios.delete('/api/users')
        .then(() => {
            eventBus.$emit('logout-event')
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';
  .delete-button {
    background-color: $light-red;
    color: black;
    border: 3px solid $red;
  }
</style>
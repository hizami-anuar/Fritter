<template>
  <div class="delete user">
    <form id="deleteUser" v-on:submit.prevent="deleteUser">
      <router-link 
        to="/"
        v-on:click.prevent="deleteUser">
        Delete My Account
      </router-link>
    </form>
  </div>
</template>

<script>

import axios from "axios";
import { eventBus } from "../main";

export default {
  name: 'DeleteUser',
  emits: ['logout-event'],
  methods: {
    deleteUser() {
      axios.delete('/api/users')
      .then(() => {
          eventBus.$emit('logout-event')
      })
    },
  },
}
</script>
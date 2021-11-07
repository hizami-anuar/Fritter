<template>
  <div class="home">
    <div v-if="user">
      <FreetViewer
        :freets="freets"
      />
    </div>
    <div v-else>
      <h1>Hoot hoot! Welcome to Fritter! Create an account or login to begin!</h1>
      <button v-if="!user" v-on:click="createAccountPage"> Create New Account </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import FreetViewer from "../components/FreetViewer.vue"

export default {
  name: 'Home',
  props: ['user'],
  components: {FreetViewer},
  mounted: function () {
    this.getFreets(); // when the page is initially loaded, get the list of freets by all authors to display.
    console.log("HERE", this.freets, this.user);
    /**
     * User just finished editing a Freet. Get Freets again.
     */
    eventBus.$on('freet-action-finished', () => {
      this.getFreets();
    });
  },
  data: function () {
    return {
      freets: [], // list of freets to display in the feed
    }
  },
  methods: {
    createAccountPage() {
      eventBus.$emit("show-create-account");
    },
    getFreets() {
      if (this.user) {
        axios
          .get('/api/freets/' + this.user.username + '/following')
          .then(response => {
            console.log(response);
            this.freets = response.data.slice().reverse();
          })
      }
    }
  },
}
</script>

<style scoped>
  .banner {
    width: 70%;
    max-height: 500px;
    border-radius: 15px;
    object-fit: cover;
  }

  .spacer {
    width: 100%;
    height: 1em;
  }
</style>
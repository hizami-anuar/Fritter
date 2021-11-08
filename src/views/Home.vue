<template>
  <div class="home">
    <div v-if="user">
      <FreetViewer 
        :user="user" 
        :freets="freets" 
        :followEnabled="false" 
        :noFreetsMessage="'Click on a Freet to view its Refreets!'">

        <template v-slot:freetOptions>
          <ActionBar />
        </template>

      </FreetViewer>
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
import ActionBar from "../components/ActionBar.vue"

export default {
  name: 'Home',
  props: ['user'],
  components: { FreetViewer, ActionBar },
  mounted: function () {
    this.getFreets(); // when the page is initially loaded, get the list of freets by all authors to display.
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
            console.log("RESPONSE", response);
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
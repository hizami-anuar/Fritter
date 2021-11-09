<template>
  <div class="home">
    <div v-if="user">
      <div class="App-container">
        <AllFreets v-if="freets.length > 0"
          :freets="freets"
          :user="user"
          :onlyFollowing="false" />
        <div v-else>
          <h1>You aren't following any users!</h1>
          <h1>Go to <router-link :to="{ name: 'Explore' }">Explore</router-link> to discover other users!</h1>
        </div>
      </div>
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
import AllFreets from "../components/AllFreets";

export default {
  name: 'Home',
  props: ['user'],
  components: { AllFreets },
  mounted() {
    this.refreshFreets(); 
    eventBus.$on('refresh-freets', () => {
      this.getFreets();
    });
  },
  data() {
    return {
      freets: [],
      sort: 'newest',
    }
  },
  methods: {
    createAccountPage() {
      eventBus.$emit("show-create-account");
    },
    refreshFreets() {
      let q = undefined;
      if (this.$route) {
        q = this.$route.query;
      }
      this.sort = q.sort || 'newest';
      this.getFreets();
    },
    getFreets() {
      if (this.user) {
        axios
          .get(`/api/freets/?following=true&sort=${this.sort}`)
          .then(response => {
            this.freets = response.data;
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
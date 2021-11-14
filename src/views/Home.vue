<template>
  <div class="home">
    <div v-if="user">
      <div v-if="freets">
        <AllFreets v-if="freets.length > 0"
          :freets="freets"
          :user="user"
          :refreetChain="refreetChain" />
        <div v-else>
          <h1>You aren't following any users!</h1>
          <h1>Go to <router-link :to="{ name: 'Explore' }">Explore</router-link> to discover other users!</h1>
        </div>
      </div>
    </div>
    <div class="homepage" v-else>
      <div class="title">Fritter</div>
      <h3>Share your day with the world</h3>
      <h3>"My first word was Hoot. My second word was hoot hoot. My third word..."</h3>
      <button v-if="!user" @click="showCreateAccount"> Sign up </button>
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
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  data() {
    return {
      freets: undefined,
      refreetChain: undefined,
      sort: 'newest',
      eventListeners: [
        {name: 'refresh-freets', func: this.refreshFreets},
        {name: 'show-all-freets', func: this.getFreets},
        {name: 'show-refreet-chain', func: this.getRefreetChain},
      ]
    }
  },
  methods: {
    showCreateAccount() {
      eventBus.$emit("show-create-account");
    },
    getRefreetChain(id) {
      axios.get(`/api/freets/${encodeURIComponent(id)}/children`)
        .then((result) => {
          this.refreetChain = result.data;
        }).catch((error) => {
          console.log(error);
        })
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
      axios
        .get(`/api/freets/?following=true&sort=${this.sort}`)
        .then(response => {
          this.freets = response.data;
        }).catch((error) => {
          this.freets = [];
          console.log(error);
        })
    }
  },
}
</script>

<style scoped>
  .homepage {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url("../assets/hooty-background.png");
    background-repeat: no-repeat;
    background-size: contain;
  }

  .title {
    background-color: var(--purple);
    font-size: 144px;
    color: white;
    padding: 15px;
    border-radius: 10px;
    font-family: 'Rowdies', Courier, monospace;
  }

  h3 {
    font-weight: bold;
  }

  .spacer {
    width: 100%;
    height: 1em;
  }

  button {
    color: var(--purple);
    border-color: var(--purple);
  }
</style>
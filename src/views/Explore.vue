<template>
  <div class="App-container">
    <AllFreets 
      :freets="freets" 
      :user="user" 
      :refreetChain="refreetChain"  
    />
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import AllFreets from '../components/AllFreets.vue';

export default {
  name: "Explore",
  props: ["user"],
  components: { AllFreets },
  data: function () {
    return {
      refreetChain: undefined,
      freets: [],
      eventListeners: [
          {name: 'refresh-freets', func: this.refreshFreets},
          {name: 'show-single-freet', func: this.getSingleFreet},
          {name: 'show-all-freets', func: this.getFreets},
          {name: 'show-following', func: this.getFollowing},
          {name: 'search', func: this.search},
          {name: 'show-refreet-chain', func: this.getRefreetChain},
        ]
    }
  },
  created() {
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  mounted() {
    this.refreshFreets();
  },
  methods: {
    refreshFreets() {
      let q = undefined;
      if (this.$route) {
        q = this.$route.query;
      }
      this.sort = q.sort || 'newest';
      if (q.id) {
        this.getSingleFreet(q.id);
      } else if (q.author) {
        this.search(q.author);
      } else if (q.following === 'true') {
        this.getFollowing();
      } else {
        this.getFreets();
      }
    },

    getFollowing() {
      axios.get("/api/freets/" + encodeURIComponent(this.user.userID) + "/following")
        .then((result) => {
          this.freets = result.data;
          this.viewFollowing = true;
          this.searchingAuthor = "";
          this.viewingId = "";
        }).catch((error) => {
          this.viewFollowing = true;
          this.freets = [];
          console.log(error);
        })
    },
    
    getSingleFreet(id) {
      this.$router.push({ name: 'Explore', query: { id: id } }).catch(()=>{});
      axios.get(`/api/freets/${id}`)
        .then((result) => {
          this.freets = result.data;
          this.searchingAuthor = "";
          this.viewFollowing = false;
          this.viewingId = id;
        }).catch((error) => {
          this.viewingId = id;
          this.freets = [];
          console.log(error);
        })
    },
    
    getFreets() {
      axios.get(`/api/freets?sort=${this.sort}`)
        .then((result) => {
          console.log(result);
          this.freets = result.data;
          this.searchingAuthor = "";
          this.viewFollowing = false;
          this.viewingId = "";
        }).catch((error) => {
          console.log(error);
        })
    },
    
    search(author) {
      axios.get(`/api/freets/?author=${encodeURIComponent(author)}&sort=${this.sort}`)
        .then((result) => {
          this.freets = result.data;
          this.searchingAuthor = author;
          this.viewingId = "";
        }).catch((error) => {
          console.log(error);
        })
    },

    getRefreetChain(id) {
      axios.get(`/api/freets/${encodeURIComponent(id)}/children`)
        .then((result) => {
          this.refreetChain = result.data;
        }).catch((error) => {
          console.log(error);
        })
    },
  },
}
</script>

<style>
.App-container {
    max-width: 100%;
    width: 100vw;
    height: calc(100vh - 75px);
}

.Main-container {
    width: auto;
    max-width: 50vw;
    margin: auto;
    height: 100%;
    left: 0px;
    top: 0px;

    padding: 0px 24px;

    background: white;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}
</style>

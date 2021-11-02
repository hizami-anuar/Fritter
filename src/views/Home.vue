<template>
  <div class="home">
    <img class="banner" alt="Welcome by Hooty" src="../assets/hooty-welcome.jpg"/>
    <div v-if="user">
      <main>
        <h1>Hoot hoot! Go to <router-link to="/explore">Explore</router-link> to see other users' freets, or create your own!</h1>
      </main>
    </div>
    <div v-else>
      
      <h1>Hoot hoot! Welcome to Fritter! Create an account or login to begin!</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

export default {
  name: 'Home',
  props: ['user'],
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
  components: {
  },
  methods: {
    getFreets() {
      if (this.user) {
        axios
          .get('/api/followers/feed')
          .then(response => {
            this.freets = response.data.freets.slice().reverse()
            // Sort by likes? response.data.freets.sort((freetA, freetB) => freetB.upvoteCount - freetA.upvoteCount);
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
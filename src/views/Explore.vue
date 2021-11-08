<template>
  <div class="App-container">
    <FreetViewer 
      :user="user" 
      :freets="freets" 
      :followEnabled="true">
      <template v-slot:freetOptions>
        <ActionBar />
      </template>
    </FreetViewer>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import FreetViewer from '../components/FreetViewer.vue';
import ActionBar from '../components/ActionBar.vue';

export default {
  name: "home",
  props: ["user"],
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
    getFreets() {
      axios
        .get('/api/freets')
        .then(response => {
          this.freets = response.data.slice().reverse();
        })
    }
  },
}
</script>

<style>
.App-container {
    max-width: 100%;
    width: 100vw;
    height: 98vh;
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

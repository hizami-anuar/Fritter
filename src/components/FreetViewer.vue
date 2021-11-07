<template>
  <div class="two-panel-container">
    <div class="freet-scroll-container">
      <Freet 
      v-for="freet of freets" 
      v-bind:key="freet.freetID" 
      v-on:click="showRefreets(freet.freetID)"
      :freet="freet" 
      :user="user" 
      :type="'complex'">
      </Freet>
    </div>
    <div class="refreet-container">
      <div v-if="refreetChain">
        <Freet
          v-for="freet of freets" 
          v-bind:key="freet.freetID" 
          :freet="freet" 
          :user="user"/>
      </div>
      <div v-else>
        <h3>Click on a Freet to view its Refreets!</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Freet from "./Freet";
import {eventBus} from "../main";

export default {
  name: "FreetViewer",
  components: { Freet },
  props: ["user", "freets"],
  data() {
    return {
        invalidFreet: false,
        freetFailMessage: "",
        viewingId: "",
        viewFollowing: false,
        sort: "newest",
        refreetChain: undefined,
    };
  },
  created: function() {
    eventBus.$on('change-sort', () => {
      this.toggleSort();
    })
    eventBus.$on('show-refreet-chain', (data) => {
      this.showRefreets(data.id);
    })
  },
  mounted: function() {
  },
  methods: {
    showRefreets(id) {
      axios.get(`/api/freets/${encodeURIComponent(id)}/children`)
      .then((result) => {
        console.log(result.data);
        this.refreetChain = result.data;
      }).catch((error) => {
        console.log(error);
      })
    },

    showFollowing() {
      eventBus.$emit('show-following', {following: 'true'});
    },
    
    getFollowing() {
      axios.get("/api/freets/" + encodeURIComponent(this.user.userID) + "/following")
        .then((result) => {
          this.allFreets = result.data;
          this.viewFollowing = true;
          this.searchingAuthor = "";
          this.viewingId = "";
        }).catch((error) => {
          this.viewFollowing = true;
          this.allFreets = [];
          console.log(error);
        })
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../variables.scss';

.two-panel-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.freet-scroll-container {
  height: 70vh;
  /* padding: var(--m) var(--m); */
  /* margin: auto; */
  overflow-y: auto;
  flex-grow: 1;
}

.refreet-container {
  background-color: var(--grey);
  padding: 1em;
  flex-grow: 1;
}

.sort-container {
  display: flex;
  justify-content: space-around;
}

.sort-item {
  cursor: pointer;
}

.sort-icon {
  width: 150px;
  height: 150px;
}

.sort-text {
  margin: 0px;
  padding: 0px;
  font-size: 40px;
  font-weight: bolder;
  color: $red;
}

</style>
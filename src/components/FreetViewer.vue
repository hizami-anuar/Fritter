<template>
  <div class="two-panel-container">
    <div class="first-column">
      <slot name="header"></slot>
      <div v-if="sortedFreets.length > 0" class="freet-scroll-container">
        <slot name="freetOptions"></slot>
        <PostCard
          v-for="(freet, index) of sortedFreets"
          :key="freet.freetID"
          :followEnabled="followEnabled"
          :index="index"
          :freet="freet" 
          :user="user" 
          :complex="true"
          />
      </div>
      <div v-else class="freet-scroll-container">
        <h3>{{noFreetsMessage}}</h3>
      </div>
    </div>

    <div class="refreet-container">
      <div v-if="refreetChain">
        <PostCard
          v-for="(freet, index) of freets"
          :key="freet.freetID"
          :index="index"
          :freet="freet" 
          :user="user" 
          :complex="false"
          />
      </div>
      <div v-else>
        <h3>Click on a Freet to view its Refreets!</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";

import PostCard from "./PostCard";

export default {
  name: "FreetViewer",
  components: { PostCard },
  props: ["user", "freets", "followEnabled", "noFreetsMessage"],
  data() {
    return {
      sort: "newest",
      sortedFreets: undefined,
      refreetChain: undefined,
    };
  },
  created: function() {
    this.sortNewest();

    eventBus.$on('change-sort', () => {
      this.toggleSort();
    });
    eventBus.$on('show-refreet-chain', (id) => {
      this.showRefreets(id);
    });
    eventBus.$on("sortFreets", option => this.sortFreets(option));
  },
  mounted: function() {
  },
  watch: {
    // whenever freets changes, we want to recompute sort
    freets: function () {
      switch (this.sort) {
        case "newest":
          this.sortNewest();
          break;
        case "popular":
          this.sortPopular();
          break;
        case "random":
          this.sortRandom();
          break;
      }
    }
  },
  methods: {
    /**
     * Sort Functions
     */ 

    sortNewest() {
      this.sort = "newest";
      this.sortedFreets = this.freets;
    },

    sortPopular() {
      this.sort = "popular";
      this.sortedFreets = this.freets.slice().sort((first, second) => second.likes.length - first.likes.length);
    },
    
    sortRandom() {
      this.sort = "random";
      this.sortedFreets = this.freets.slice().sort(() => Math.random() - Math.random())
    },

    sortFreets (option) {
      console.log("HERE", option);
      switch (option) {
        case "New":
          this.sortNewest();
          break;
        case "Likes":
          this.sortPopular();
          break;
        case "Random":
          this.sortRandom();
          break;
      }
    },

    /**
     * Freet Displaying Functions
     */
    showRefreets(id) {
      axios.get(`/api/freets/${encodeURIComponent(id)}/children`)
      .then((result) => {
        this.refreetChain = result.data;
      }).catch((error) => {
        console.log(error);
      })
    },

    showAllFreets() {
      eventBus.$emit('refresh-freets');
    },

    showFollowing() {
      eventBus.$emit('show-following', {following: 'true'});
    },
    
    getFollowing() {
      axios.get("/api/freets/" + encodeURIComponent(this.user.userID) + "/following")
        .then((result) => {
          this.allFreets = result.data;
        }).catch((error) => {
          console.log(error);
        })
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../variables.scss';

::-webkit-scrollbar {
    width:10px
}

::-webkit-scrollbar-thumb {
    background: var(--red);
    border-radius: 10px;
}

.two-panel-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.first-column {
  height: calc(100vh - 66px);
  width: 60vw;
}

.freet-scroll-container {
  padding: 1em;
  overflow-y: scroll;
}

.refreet-container {
  overflow-y: scroll;
  height: calc(100vh - 66px);
  box-sizing: border-box;
  background-color: var(--grey);
  padding: 1em;
  width: 40vw;
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
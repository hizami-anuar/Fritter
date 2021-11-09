<template>
  <div class="two-panel-container">
    <div class="first-column">
      <div class="sort-container">
        <SortBar />
      </div>

      <div class="freet-scroll-container">
        <Freet 
          v-for="freet of freets" 
          v-bind:key="freet.freetID" 
          :freet="freet" 
          :user="user" 
          :type="'complex'">
        </Freet>
      </div>

    </div>
    <div class="second-column">
      <template v-if="refreetChain">
        <RefreetChain 
          :key="refreetChain.freetID"
          :freet="refreetChain"
          :user="user"
        />
      </template>
      <template v-else>
        <h3>Click on a Freet to view its Refreets!</h3>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Freet from "./Freet";
import RefreetChain from "./RefreetChain";
import SortBar from "./SortBar";
import { eventBus } from "../main";

export default {
  name: "freets",
  components: { Freet, RefreetChain, SortBar },
  props: ["user", "freets", "refreetChain"],
  data() {
    return {
        newFreet: "",
        invalidFreet: false,
        freetFailMessage: "",
        sort: "newest",
        eventListeners: [
          {name: "sortFreets", func: this.setSort},
        ],
    };
  },
  created() {
    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
  },
  methods: {
    createNewFreet() {
      axios.post("/api/freets", {content: this.newFreet})
      .then(() => {
        this.invalidFreet = false;
        this.freetFailMessage = "";
        this.newFreet = "";
        eventBus.$emit('refresh-freets');
      })
      .catch((error) => {
        this.invalidFreet = true;
        this.freetFailMessage = error.response.data.error;
      })
    },

    setSort(sort) {
      switch (sort) {
        case "New":
          this.setSortNewest();
          break;
        case "Likes":
          this.setSortPopular();
          break;
        case "Random":
          this.setSortRandom();
          break;
      }
    },

    setSortNewest() {
      this.sort = "newest";
      let query = Object.assign({}, this.$route.query);
      query.sort = 'newest';
      delete query.id;
      this.$router.push({ query: query }).catch(()=>{});
    },

    setSortPopular() {
      this.sort = "popular";
      let query = Object.assign({}, this.$route.query);
      query.sort = 'popular';
      delete query.id;
      this.$router.push({ query: query }).catch(()=>{});
    },

    setSortRandom() {
      this.sort = "random";
      let query = Object.assign({}, this.$route.query);
      query.sort = 'random';
      delete query.id;
      this.$router.push({ query: query }).catch(()=>{});
      eventBus.$emit('refresh-freets');
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../variables.scss';

.two-panel-container {
  height: 100%;
  display: flex;
  flex-direction: row;
}

.first-column {
  height: 95%;
  width: 60vw;
}

.freet-scroll-container {
  padding-top: 20px;
  height: 80%;
  overflow-y: scroll;
}

.second-column {
  height: 100%;
  width: 40vw;
  overflow-y: scroll;
}

.sort-container {
  display: flex;
  justify-content: space-around;
  height: auto;
}

</style>
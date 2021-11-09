<template>
  <div class="two-panel-container">
    <div class="first-column">
      <div class="sort-container">
        <div class="sort-item" v-on:click="setSortNewest">
          <img class="sort-icon" src="../assets/logo.png" />
          <p class="sort-text">Newest</p>
        </div>
        <div class="sort-item" v-on:click="setSortPopular">
          <img class="sort-icon" src="../assets/logo.png" />
          <p class="sort-text">Popular</p>
        </div>
        <div class="sort-item" v-on:click="setSortRandom">
          <img class="sort-icon" src="../assets/logo.png" />
          <p class="sort-text">Random</p>
        </div>
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
import {eventBus} from "../main";

export default {
  name: "freets",
  components: { Freet, RefreetChain },
  props: ["user", "freets", "refreetChain"],
  data() {
    return {
        newFreet: "",
        invalidFreet: false,
        freetFailMessage: "",
        sort: "newest",
    };
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
  display: flex;
  flex-direction: row;
}

.first-column {
  height: calc(100vh - 66px);
  width: 60vw;
}

.second-column {
  width: 35vw;
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
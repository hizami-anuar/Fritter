<template>
  <div class="two-panel-container">
    <div class="first-column">
      <slot></slot>
      
      <div class="sort-container">
        <ActionBar
          :user="user" 
          :options="sortOptions" 
          :handler="setSort"/>
      </div>

      <div class="freet-scroll-container">
        <Freet 
          v-for="freet of freets" 
          v-bind:key="freet.freetID" 
          :freet="freet" 
          :user="user" 
          :type="'complex'"/>
      </div>
    </div>

    <div class="second-column">
      <template v-if="refreetChain">
        <RefreetChain 
          :key="refreetChain.freetID"
          :freet="refreetChain"
          :user="user"/>
      </template>
      <template v-else>
        <h3>Click on a Freet to view its Refreets!</h3>
      </template>
    </div>
  </div>
</template>

<script>
import Freet from "./Freet";
import RefreetChain from "./RefreetChain";
import ActionBar from "./ActionBar";
import { eventBus } from "../main";

export default {
  name: "freets",
  components: { Freet, RefreetChain, ActionBar },
  props: ["user", "freets", "refreetChain"],
  data() {
    return {
        newFreet: "",
        invalidFreet: false,
        freetFailMessage: "",
        sort: "newest",
        sortOptions: [
          {label: "New", type: "newest", imageName: "new"},
          {label: "Likes", type: "popular", imageName: "filled-heart"},
          {label: "Random", type: "random", imageName: "random"},
        ],
    };
  },
  methods: {
    setSort(sortType) {
      this.sort = sortType;
      let query = Object.assign({}, this.$route.query);
      query.sort = sortType;
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
  display: flex;
  flex-direction: column;
  height: calc(100vh - 75px);
  overflow: hidden;
  width: 60vw;
}

.freet-scroll-container {
  padding-top: 30px;
  overflow-y: scroll;
}

.second-column {
  height: calc(100vh - 75px);
  width: 40vw;
  overflow-y: scroll;
  background: $grey;
}

.sort-container {
  display: flex;
  justify-content: space-around;
  height: auto;
}

</style>
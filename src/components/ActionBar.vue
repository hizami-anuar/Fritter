<template>
  <div class="ActionBar">
    <h1>Sort Options</h1>
    <div class="sortOptions">
      <div
        v-for="(option, index) of options"
        :key=index
        >
        <div class="optionContainer">
          <img 
            :src="require('@/assets/' + imageNames[index] + '.svg')"  
            @click="clickEvent(option)"
            alt=option 
            class="optionIcon">
        </div>
        <h3>{{ option }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import {eventBus} from "../main";

export default {
  name: "ActionBar",
  components: {},
  props: ["user"],
  data() {
    return {
      options: ["Likes", "New", "Random"],
      imageNames: ["filled-heart", "new", "random"]
    };
  },
  created: function() {
  },
  mounted: function() {
  },
  methods: {
    clickEvent(option) {
      eventBus.$emit("sortFreets", option);
    }
  },
};
</script>

<style scoped>
  .sortOptions {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
  }

  .optionContainer {
    width: 80px;
    height: 80px;
    border: 1px solid var(--purple);
    background-color: var(--purple);
    border-radius: 50%;
  }

  .optionIcon {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(98deg) brightness(106%) contrast(101%);
    width: 40px;
    margin: 20px;
  }

  .optionIcon:hover {
    cursor: pointer;
  }
</style>
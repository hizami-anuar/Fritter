<template>
  <div class="sort-bar">
    <div class="sort-options">
      <div
        v-for="(option, index) of options"
        :key=index
        >
        <div class="option-container">
          <img 
            :src="require('@/assets/' + option.imageName + '.svg')"  
            @click="clickEvent(option.type)"
            alt=option 
            class="option-icon">
        </div>
        <h3>{{ option.label }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import {eventBus} from "../main";

export default {
  name: "ActionBar",
  components: {},
  props: ["user", "options"],
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
  h3 {
    color: purple;
  }

  .sort-bar {
    width: 100%;
  }

  .sort-options {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
  }

  .option-container {
    width: 80px;
    height: 80px;
    border: 1px solid var(--purple);
    background-color: var(--purple);
    border-radius: 50%;
  }

  .option-icon {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(98deg) brightness(106%) contrast(101%);
    width: 40px;
    margin: 20px;
  }

  .option-icon:hover {
    cursor: pointer;
  }
</style>
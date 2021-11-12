<template>
  <div class="action-bar">
    <div class="action-bar-options">
      <div
        v-for="(option, index) of options"
        :key=index
        >
        <div class="option-container"
          @click="handler(option.type)"
        >
          <img 
            :src="require('@/assets/' + option.imageName + '.svg')"  
            alt=option 
            class="option-icon">
        </div>
        <h3>{{ option.label }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActionBar",
  props: ["user", "handler", "options"],
};
</script>

<style scoped>
  h3 {
    color: purple;
  }

  .action-bar {
    width: 100%;
  }

  .action-bar-options {
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
    cursor: pointer;
  }

  .option-icon {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(98deg) brightness(106%) contrast(101%);
    width: 40px;
    margin: 20px;
  }
</style>
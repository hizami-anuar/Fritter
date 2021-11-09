<template>
  <div class="chain-container">
    <Freet
      :freet="freet" 
      :user="user" 
      :type="'chain'">
    </Freet>
    <div class="children-container">
      <div class="children-left-bar"></div>
      <div class="children-display">
        <RefreetChain 
          v-for="refreet of freet.children.filter((child) => child != 'deleted')"
          :key="refreet.id"
          :freet="refreet" 
          :user="user">
        </RefreetChain>
      </div>
    </div>
  </div>
</template>

<script>
import Freet from './Freet';

export default {
  name: "RefreetChain",
  components: { Freet },
  props: ["freet", "user"],
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.chain-container {
  width: 100%;
}

.children-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.children-left-bar {
  position: relative;
  top: -10px;
  left: 60px;
  height: auto;
  width: 10px;
  background-color: $purple;
}

.children-display {
  position: relative;
  left: 15px;
  width: calc(100% - 25px);
  display: flex;
  flex-direction: column;
}
</style>
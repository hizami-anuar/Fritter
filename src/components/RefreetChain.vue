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
import variables from '../variables.scss';

export default {
  name: "RefreetChain",
  components: { Freet },
  props: ["freet", "user"],
  data() {
    return {
      variables: variables,
      editing: false,
      editFreetError: "",
      newContent: "",
      likeError: "",
      refreeting: false,
      refreetError: "",
      refreetContent: "",
      freetColor: "$red", 
    }
  }
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
  float: left;
  left: 30px;
  height: auto;
  width: 10px;
  background-color: $purple;
}

.children-display {
  position: relative;
  left: 15px;
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
}
</style>
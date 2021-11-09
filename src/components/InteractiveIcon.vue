
<template>
  <span class="icon-container" v-on:click="handler">
    <slot name="image"></slot>
    <span class="hovertext">{{hovertext}}</span>
  </span>
</template>

<script>
export default {
  name: "InteractiveIcon",
  props: ["handler", "hovertext"],
}
</script>

<style lang='scss' scoped>
@import '../variables.scss';

.interactive-icon {
  width: 15px;
  height: 15px;
  margin: 0px 2px 0px 2px;
  cursor: pointer;
}
.icon-container {
  display: flex;
  justify-content: center;
  position: relative;
}

.icon-container .hovertext {
  visibility: hidden;
  background-color: black;
  color: white;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  bottom: 100%;
}

.icon-container:hover .hovertext:not(:hover) {
  visibility: visible;
}
</style>
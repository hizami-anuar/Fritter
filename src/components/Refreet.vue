<template>
  <div v-if="refreet" class="refreet-container" :style="{'--refreet-color': user.userID===refreet.userID ? variables.lightPurple : variables.lightRed }">
    <div v-if="refreet == 'deleted'">
    <p>The content you are looking for has been deleted.</p>
    </div>
    <div v-else>
      <div class="refreet-header">
        <span class="refreet-author-text"> @{{refreet.author}}: </span>
      </div>
      <div class="refreet-body">
        <p class="refreet-body-text">{{refreet.content}}</p>
        <span v-if="refreet.refreet" class="refreet-refreet-container">This freet contains a refreet.</span>
      </div>
      <div class="refreet-footer">
        <a href="javascript:;" @click="getRefreet"> View This Freet </a>
        <span v-if="refreet.edited" class="edited-text">Edited</span>
      </div>
    </div>
  </div>
</template>

<script>
import {eventBus} from "../main";
import variables from '../variables.scss';

export default {
  name: "Refreet",
  props: ["user", "refreet"],
  data() {
    return {
      variables,
    };
  },
  methods: {
    getRefreet: function() {
      eventBus.$emit('show-single-freet', {id: this.refreet.freetID});
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../variables.scss';

.refreet-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--refreet-color);
  border: 7.5px solid var(--refreet-color);
  border-radius: 20px;
  width: 90%;
  margin: 10px;
  overflow: hidden;
}

.refreet-refreet-container {
  border: 1px solid black;
  border-radius: 5px;
  margin: 5px;
}

.edited-text {
  width: 100%;
  text-align: right;
  font-weight: bold;
}

.refreet-header {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 20px;
}

.refreet-author-text {
  margin: 0px;
  padding: 0px;
  font-weight: bold;
  color: white;
}

.refreet-body {
  background: white;
  min-height: 60px;
  padding: 10px;
  border-radius: 10px;
}

.refreet-body-text {
  display: flex;
  justify-content: flex-start;
  width: 90%;
  margin: 0px;
  padding: 0px;
  font-weight: bold;
  color: black;
}

.refreet-footer {
  height: 20px;
}
</style>

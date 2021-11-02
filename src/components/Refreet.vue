<template>
  <div v-if="refreet" class="refreet-container">
    <div v-if="refreet == 'deleted'">
    <p>The content you are looking for has been deleted.</p>
    </div>
    <div v-else>
      <div class="refreet-header">
        <span class="refreet-author-text"> @{{refreet.author}}: </span>
      </div>
      <div class="refreet-body">
        <p>{{refreet.content}}</p>
      </div>
      <div class="refreet-footer">
        <span> Likes: {{refreet.likes.length}} </span>
        <span v-if="refreet.refreet" class="refreet-refreet-container">This freet contains a refreet.</span>
        <a href="javascript:;" @click="getRefreet"> View This Freet </a>
        <span v-if="refreet.edited" class="edited-text">Edited</span>
      </div>
    </div>
  </div>
</template>

<script>
import {eventBus} from "../main";

export default {
  name: "Refreet",
  props: ["refreet"],
  data() {
    return {
    };
  },
  methods: {
    getRefreet: function() {
      eventBus.$emit('show-single-freet', {id: this.refreet.freetID});
    },
  },
};
</script>

<style lang='scss'>
@import '../variables.scss';

.refreet-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: $light-red;
  border: 7.5px solid $light-red;
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
}

.refreet-footer {
  height: 20px;
}
</style>

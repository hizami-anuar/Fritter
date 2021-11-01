<template>
  <div v-if="refreet" class="refreet-container">
    <div v-if="refreet == 'deleted'">
    <p>The content you are looking for has been deleted.</p>
    </div>
    <div v-else>
    <h3> @{{refreet.author}}: </h3>
    <div> Likes: {{refreet.likes.length}} </div>
    <p>{{refreet.content}}</p>
    <div v-if="refreet.refreet" class="refreet-refreet-container">This freet contains a refreet.</div>
    <a href="javascript:;" @click="getRefreet"> View This Freet </a>
    <div v-if="refreet.edited" class="edited-text">Edited</div>
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

<style>
.refreet-container {
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
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
</style>

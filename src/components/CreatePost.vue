<template>
  <div>
    <div class="container" v-if='active'>
      <div class="createPost">
        <textarea maxlength="140" name="content" placeholder="Click here to begin writing" v-model="content">
        </textarea>
        <div class="createRefreet" v-if="parent">
          <label class="createRefreetLabel" for="createRefreetCard">
            {{parent.author}} said: 
            <span
              class="removeRefreet"
              v-on:click="() => setParent()"
            >(undo)</span>
          </label>
          <PostCard
            id="createRefreetCard"
            :freet="parent"
            :user="user"
            :complex="false"
            :index="0"
          />
        </div>
        <div class="postBar">
          <h2> {{ this.user.username }} </h2>
          <span></span>
          <button v-on:click="deactivate"> Cancel </button>
          <button v-on:click="createFreet" :disabled="content.length === 0"> Post </button>
        </div>
      </div>
    </div>
    <button 
      class="writeFreetButton"
      v-else
      v-on:click="activate">
      <slot></slot>
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import {eventBus} from "../main";

import PostCard from '../components/PostCard.vue';

export default {
  name: 'CreatePost',
  props: ['user'],
  components: {
    PostCard,
  },
  data: function () {
    return {
      content: "",  // content of the freet about to be posted
      parent: null,  // the refreet parent, or null
      active: false,  // whether this component is active or in button mode
    }
  },
  mounted: function () {
    /**
     * User clicked the refreet button
     */
    eventBus.$on('start-refreet', (freet) => {
      this.activate();
      this.setParent(freet);
    });
  },
  methods: {
    /**
     * Emits a getFreets event with the current content to explore page to actually 
     * post the freet and display it in the feed.
     * After a post event, the feed is back to the list of freets  all authors by default.
     */
    createFreet() {
      let route = '/api/freets/';
      if (this.parent !== null) route += this.parent.id;
        
      axios
        .post(route, {content: this.content})
        .then(async () => {
          this.deactivate();
          eventBus.$emit("show-all-freets");
        });
    },
    /**
     * Sets the refreet parent (or clears if no arguments given)
     * 
     * @param {?Freet} parentId the refreet parent, or null
     */
    setParent(parent=null) {
      this.parent = parent;
    },
    activate() {
      this.active = true;
    },
    deactivate() {
      this.active = false;
      this.content = "";
      this.setParent();
    },
  },
}
</script>

<style scoped>
  .container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(100, 100, 100, 0.5);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .createPost {
    min-width: 200px;
    max-width: 600px;
    width: calc(100% - 20px);
    border: 1px solid;  
    background: white;
    outline: solid white;
    margin: 10px;
  }

  textarea {
    min-height: 100px;
    width: calc(100% - 20px);
    height: 100%;
    resize: none;
    padding: 10px;
    border: none;
    background: none;
    outline: none;
  }

  button {
    margin: 0 0 0 10px;
  }
  
  .createRefreetLabel {
    font-size: medium;
  }

  .postBar {
    border-top: 1px solid;
    display: flex;
    align-items: center;
    margin: 10px 10px 0px 10px;
  }

  .writeFreetButton {
    border: 0;
    background: none;
    cursor: pointer;
    font-size: x-large;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .writeFreetButton:hover {
    background: rgba(100, 100, 100, 0.2);
  }

  span {
    width: 100%;
  }
  
  .logo {
    margin: 0;
  }

  div {
    border-color: grey;
  }

  h2 {
    white-space: nowrap;
  }
</style>

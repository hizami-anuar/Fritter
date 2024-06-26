<template>
  <div>
    <div class="container" v-if='active'>
      <div class="createPost">
        <div class="createHeader">
          <span class="user-icon">
            {{ this.user.username[0].toUpperCase() }}
          </span>
          <h2> @{{ this.user.username }} </h2>
        </div>
        <main class="createContent">
          <textarea maxlength="140" name="content" placeholder="Click here to begin writing" v-model="content">
          </textarea>
          <div class="createRefreet" v-if="parent">
            <label class="createRefreetLabel" for="createRefreetCard">
            </label>
            <PostCard
              id="createRefreetCard"
              :freet="parent"
              :user="user"
              :complex="false"
              :index="0"
            />
          </div>
        </main>
        <div class="postBar">
          <span></span>
          <button v-on:click="deactivate"> Cancel </button>
          <button v-on:click="createFreet" :disabled="content.length === 0"> Post </button>
        </div>
      </div>
    </div>
    <div @click="activate">
      <slot></slot>
    </div>
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
      let route = '/api/freets';

      if (this.parent !== null) {
        axios
        .post(route, 
          {
            content: this.content, 
            refreet: this.parent.freetID
          })
        .then(() => {
          this.deactivate();
          eventBus.$emit('refresh-freets');
          if (this.$route.path !== '/explore' && this.$route.path !== '/profile') {
            this.$router.push('/profile');
          }
        })
        route += this.parent.id;
      } else {
        axios
          .post(route, {content: this.content})
          .then(() => {
            this.deactivate();
            eventBus.$emit('refresh-freets');

            if (this.$route.path !== '/explore' && this.$route.path !== '/profile') {
              this.$router.push('/profile');
            }
          });
      }
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
    z-index: 10;
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
    background: var(--purple);
    border: 7.5px solid var(--purple);
    border-radius: 20px;
    margin: 10px;
  }

  textarea {
    background: white;
    color: blueviolet;
    min-height: 100px;
    width: calc(100% - 20px);
    height: 100%;
    resize: none;
    padding: 10px;
    border: none;
    outline: none;
  }

  .createContent {
    background: white;
    padding: 0 0 10px 0;
  }

  button {
    margin: 0 0 0 10px;
  }
  
  .createRefreetLabel {
    font-size: medium;
  }

  .createHeader {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 35px;
    padding-bottom: 5px;
  }

  .user-icon {
    color: var(--purple);
    font-size: 20px;
    font-family: 'Rowdies', Courier, monospace;
    border-radius: 50%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    margin: 0 5px 0 0;
  }

  .postBar {
    margin: 10px 0 0 0;
    display: flex;
    align-items: center;
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
    color: white;
    white-space: nowrap;
  }

  button {
    font-size: 20px;
    height: 28px;
    margin: 0;
    border-radius: 5px;
    padding: 0 5px;
  }
</style>

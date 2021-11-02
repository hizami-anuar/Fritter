<template>
  <article class="postCard">
    <div id="postTitle">
      <router-link :to="'/profile/' + this.freet.author"> {{ this.freet.author }}</router-link>
    </div>
    <textarea 
      class="postContent"
      maxlength="140"
      v-model = 'this.message'
      :id="`postContent-${this.freet.id}`"
      :style='postContentStyle'
      :disabled = '!this.editing'
      @input='onTextInput'
      @blur="submitEditedFreet($event)"
      @keydown.enter.exact.prevent="submitEditedFreet($event)">
    </textarea>
    <div class="postRefreet" v-if="parent && complex">
      <label class="postRefreetLabel" for="postRefreetCard">
        {{parent.author}} said: 
      </label>
      <PostCard
        id="postRefreetCard"
        :freet="parent"
        :user="user"
        :complex="false"
        :index="0"
      />
    </div>
    <div id='postBar'>
      <p>{{ freet.upvoteCount }}</p>
      <FreetInteractionBar
        v-if='user && complex'
        :user='user'
        :freet='freet'
        :index='index'
        @toggleEditing='toggleEditing'
      />
    </div>
  </article>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";
import FreetInteractionBar from './FreetInteractionBar.vue';

export default {
  name: 'PostCard',
  // Gets the freet object along with username of the current user from parent component
  // note: "freet" can be either FreetData, or ParentData if "complex" is false
  props: ["freet", "user", "index", "complex"], 
  emits: ['deleteFreet', 'getFreets'],
  components: {
    FreetInteractionBar
  },
  data: function () {
    return {
      editing: false, // whether the author is currently in edit mode with this freet/post card
      author: undefined, // the author of the freet
      message: undefined, // the body or content of the freet
      postContentStyle: undefined, // changes dynamically based on height
    }
  },
  created () {
    // inherit the author and content of the freet from the parent component (explore page)
    this.author = this.freet.author;
    this.message = this.freet.message;
    this.parent = this.freet.parent; // ParentData object contains {id, author, message}
  },
  mounted() {
    this.onTextInput();
  },
  methods: {
    /**
     * When user finishes editing the post by either clicking enter or clicking outside of the textarea.
     * Sends put request to update the freet's content.
     * After editing the freet the feed automatically updates to all of the user's freets not one by an 
     * specific author even if it was like that before the freet was editted.
     */
    submitEditedFreet () {
      this.toggleEditing();
      if (this.message.length) {
        axios
          .put('/api/freets/' + this.freet.id, { content: this.message })
          .then(() => {
              eventBus.emit('freet-action-finished');
          })
      } else {
        eventBus.emit('freet-action-finished');
      }
    },
    toggleEditing() {
      this.editing = !this.editing;
    },
    setPostContentHeight(height) {
      if (height !== "auto")
        height = Math.max(height, 34) + "px"
      this.postContentStyle = {
        height: height,
        'min-height': height,
      }
    },
    onTextInput () {
      // textarea scaling code from https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
      const box = document.getElementById(`postContent-${this.freet.id}`);
      this.setPostContentHeight(0);
      this.$nextTick(() => 
        this.setPostContentHeight(box.scrollHeight)
      );
    },
  },
}
</script>

<style scoped>
  textarea {
    color: blueviolet;
    background: none;
    outline: none;
  }
  textarea:disabled {
    color: black;
    outline: none;
  }

  .postCard {
    width: auto; 
    min-height: 110px;
    border: 1px solid;
    margin: 10px 10px 0 10px;
    display: flex;
    flex-direction: column;
  }
  
  .postRefreetLabel {
    font-size: medium;
  }

  #postTitle {
    border-bottom: 1px solid;
    margin: 0px 10px 0px 10px;
    max-height: 23px;
  }

  .postContent {
    flex: 1;
    box-sizing: border-box;
    margin: 10px;
    border: none;
    resize: none;
    overflow: hidden;
    width: calc(100% - 20px);
  }

  p {
    font-size: 12pt;
    margin: 10px;
  }

  #postBar {
    display: flex;
    align-content: baseline;
    justify-content: space-between;
    justify-self: flex-end;
  }
</style>
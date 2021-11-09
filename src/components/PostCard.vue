<template>
  <article class="postCard">
    <!-- Post Card Top Bar -->
    <div id="postTitle">
      <router-link :to="'/profile/' + this.freet.author"> @{{ this.freet.author }}</router-link>
      <span v-if="complex">
        <!-- Refreet Button -->
        <button v-on:click="getRefreetChain">Refreets</button>
        <!-- Follow button -->
        <span v-if="followEnabled">
          <button v-on:click="follow" v-if="this.user && !isFollowing()">Follow</button>
          <button v-on:click="unfollow" v-if="this.user && isFollowing()">Unfollow</button>
        </span>
      </span>
    </div>

    <!-- Post Main Content -->
    <main id="postContent">
      <textarea 
        class="postComment"
        maxlength="140"
        v-model = 'message'
        :id="`postComment-${this.freet.id}`"
        :disabled = '!this.editing'
        @input='onTextInput'
        @blur="submitEditedFreet($event)"
        @keydown.enter.exact.prevent="$event.target.blur()">
      </textarea>

      <!-- If Refreet, display parent Freet -->
      <PostCard class="postRefreet" v-if="parent && complex"
        id="postRefreetCard"
        :freet="freet.refreet"
        :user="user"
        :complex="false"
        :index="0"
      />
    </main>

    <!-- Post Card Bottom  Bar -->
    <div id='postBar'>
      <p>{{ freet.likes.length }}</p>

      <!-- All interactive buttons on bottom bar -->
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
  props: ["freet", "user", "complex", "index", "followEnabled"], 
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
    this.message = this.freet.content;
    this.parent = this.freet.refreet; // Parent is a Freet object with Freet properties
  },
  mounted() {
    this.onTextInput();
  },
  methods: {
    /**
     * Sends event that gets all Refreets of this post and displays on the righthand bar
     */
    getRefreetChain: function() {
      eventBus.$emit('show-refreet-chain', this.freet.freetID)
    },
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
          .put('/api/freets/' + this.freet.freetID, { content: this.message })
          .then(() => {
            eventBus.$emit('refresh-freets');
          })
      } else {
        eventBus.$emit('refresh-freets');
      }
    },
    toggleEditing() {
      this.editing = !this.editing;
      console.log(this.editing);
    },
    /**
     * Adjusts height based on content within Freet
     */
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
      const box = document.getElementById(`postComment-${this.freet.id}`);
      this.setPostContentHeight(0);
      this.$nextTick(() => 
        this.setPostContentHeight(box.scrollHeight)
      );
    },

    /**
     * Methods to handle Following
     */
    follow: function() {
      axios.patch("/api/users/" + encodeURIComponent(this.freet.userID) + "/following").then(() => {
        eventBus.$emit("refresh-freets");
        eventBus.$emit("refresh-user");
      }).catch((error) => {
        console.log(error);
      })
    },
    unfollow: function() {
      axios.delete("/api/users/" + encodeURIComponent(this.freet.userID) + "/following").then(() => {
        eventBus.$emit("refresh-freets");
        eventBus.$emit("refresh-user");
      }).catch((error) => {
        console.log(error);
      })
    },
    isFollowing: function() {
        return this.user && this.user.following.includes(this.freet.userID);
    },
  },
}
</script>

<style scoped>
  textarea {
    color: blueviolet;
    text-align: left;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    resize: none;
    overflow: hidden;
    font-family: 'Rowdies', Courier, monospace;
    font-size: var(--xs);
  }

  textarea:disabled {
    color: black;
    outline: none;
  }

  .postCard {
    width: auto; 
    min-height: 110px;
    border: 5px solid var(--red);
    border-radius: 10px;
    background: var(--red);
    margin: 30px 15px 30px 15px;
    display: flex;
    flex-direction: column;
  }

  .postRefreet {
    opacity: 80%;
  }
  
  .postRefreetLabel {
    font-size: medium;
  }

  #postTitle {
    display: flex;
    justify-content: space-between;
    text-align: left;
    height: 35px;
  }

  #postContent {
    min-height: 150px;
    flex: 1;
    box-sizing: border-box;
    padding: 10px;
    background-color: white;
    width: calc(100%);
  }

  p {
    font-size: 20px;
    color: white;
    font-family: 'Rowdies', Courier, monospace;
    text-decoration: none;
    margin-left: 5px;
  }

  #postBar {
    margin-top: 5px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    justify-self: flex-end;
  }

  a {
    font-size: 20px;
    color: white;
    font-family: 'Rowdies', Courier, monospace;
    text-decoration: none;
  }

  a:hover {
    color: var(--light-blue);
  }

  button {
    font-size: 20px;
    height: 28px;
    margin: 0;
    border-radius: 5px;
    padding: 0 5px;
  }
</style>
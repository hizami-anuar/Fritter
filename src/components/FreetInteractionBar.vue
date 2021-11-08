<template>
  <div class="FreetInteractionBar">
    <div class="buttonBar" v-if='user.username===freet.author'>
      <img class="icon" v-on:click="editFreet" src="../assets/edit.svg"/>
      <img class="icon" v-on:click="deleteFreet" src="../assets/trash.svg"/>
    </div>
    <div class="buttonBar" v-else>
      <img v-if='user && !freet.likes.includes(user.userID)' class="icon" v-on:click="upvote" src="../assets/empty-heart.svg"/>
      <img v-else-if='user && freet.likes.includes(user.userID)' class="icon" v-on:click="downvote" src="../assets/filled-heart.svg"/>
      <div class="spacer"></div>
      <img class="icon" v-on:click="refreet" src="../assets/refreet.svg"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';

export default {
  name: 'FreetInteractionBar',
  props: ['user', 'freet', 'index', 'liked'],
  emits: ['toggleEditing'],
  data: function () {
    return {
      content: "" // content of the freet about to be posted
    }
  },
  mounted () {
  },
  methods: {
    /**
     * Delete the current freet and then refresh Explore view
     */
    deleteFreet () {
      if (confirm('Are you sure you want to delete this Freet?')) {
        axios
        .delete('/api/freets/' + encodeURIComponent(this.freet.freetID))
        .then(() => {
          eventBus.$emit('freet-action-finished');
        })
      }
    },
    /**
     * Change to editing mode so user can edit the text.
     */
    editFreet () {
      this.$emit('toggleEditing');
    },
    /**
     * Change editing mode to edit a refreet of this freet
     */
    refreet () {
      eventBus.$emit('start-refreet', this.freet);
    },
    /**
     * Upvotes the freet and then updates likeCount.
     */
    upvote () {
      axios
        .patch("/api/freets/" + encodeURIComponent(this.freet.freetID) + "/likes", {
          id: this.freet.freetID,
          userID: this.user.userID
        })
        .then(() => {
          eventBus.$emit('freet-action-finished');
        })
    },
    /**
     * Downvotes the freet and then updates likeCount.
     */
    downvote () {
      axios
        .delete("/api/freets/" + encodeURIComponent(this.freet.freetID) + "/likes", {
          id: this.freet.freetID,
          userID: this.user.userID
        })
        .then(() => {
          eventBus.$emit('freet-action-finished');
        })
    },
  },
}
</script>

<style scoped>
  .FreetInteractionBar {
    display: flex;
    flex-direction: row;
    margin: 10px;
  }

  .buttonBar {
    display: flex;
    flex-direction: row;
  }
  .icon {
    width: 20px;
    height: 20px;
    margin: 0px 2px 0px 2px;
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(234deg) brightness(107%) contrast(102%);
  }

  .icon:hover {
    filter: invert(80%) sepia(71%) saturate(1171%) hue-rotate(109deg) brightness(100%) contrast(100%);
  }
</style>

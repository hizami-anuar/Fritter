<template>
  <div class="FreetInteractionBar">
    <div class="buttonBar" v-if='this.user.username===this.freet.author'>
      <img class="logo" v-on:click="editFreet" src="../assets/edit.svg"/>
      <img class="logo" v-on:click="deleteFreet" src="../assets/trash.svg"/>
    </div>
    <div class="buttonBar" v-else>
      <img v-if='user.liked && !user.liked.includes(freet.id)' class="logo" v-on:click="upvote" src="../assets/empty-heart.svg"/>
      <img v-else-if='user.liked && user.liked.includes(freet.id)' class="logo" v-on:click="downvote" src="../assets/filled-heart.svg"/>
      <img class="logo" v-on:click="refreet" src="../assets/refreet.svg"/>
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
      axios
      .delete('/api/freets/' + this.freet.id)
      .then(() => {
        eventBus.emit('freet-action-finished');
      })
    },
    /**
     * Change to editing mode so user can edit the text.
     */
    editFreet () {
      eventBus.$emit('toggleEditing');
    },
    /**
     * Change editing mode to edit a refreet of this freet
     */
    refreet () {
      eventBus.emit('start-refreet', this.freet);
    },
    /**
     * Upvotes the freet and then updates likeCount.
     */
    upvote () {
      axios
      .post('/api/users/liked?freetId=' + this.freet.id)
      .then(() => {
        eventBus.emit('freet-action-finished');
        eventBus.emit('user-change-event', {mode:'ADD', param:'liked', value:this.freet.id});
      })
    },
    /**
     * Downvotes the freet and then updates likeCount.
     */
    downvote () {
      axios
      .delete('/api/users/liked?freetId=' + this.freet.id)
      .then(() => {
        eventBus.emit('freet-action-finished');
        eventBus.emit('user-change-event', {mode:'REMOVE', param:'liked', value:this.freet.id});
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
  .logo {
    width: 15px;
    height: 15px;
    margin: 0px 2px 0px 2px;
  }

  .logo:hover {
    cursor: pointer;
  }
</style>

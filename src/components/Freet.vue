<template>
  <div class="freet-container">
    <h4> @{{freet.author}}: </h4>
    <button @click="follow" v-if="this.user && !isFollowing()">Follow</button>
    <button @click="unfollow" v-if="this.user && isFollowing()">Unfollow</button>
    <br>
    <button @click="unlike" v-if="this.user && liked()">Unlike</button>
    <button @click="like" v-if="this.user && !liked()">Like</button>
    <div v-if="likeError"> {{this.likeError}} </div>
    <div> Likes: {{freet.likes.length}} </div>
    <p>{{freet.content}}</p>
    <Refreet :refreet="freet.refreet"></Refreet>
    
    <a href="javascript:;" @click="editing=true" v-if="user.userID===freet.userID">Edit freet</a> &nbsp;
    <a href="javascript:;" @click="deleteFreet" v-if="user.userID===freet.userID">Delete freet</a> &nbsp;
    <a href="javascript:;" @click="refreeting=true" v-if="user.userID">Refreet</a>
    <div v-if="editing" class="editing-container">
        <input type="text" v-model="newContent" placeholder="New content here">
        <button @click="save" :disabled="!newContent">Save</button>
        <button @click="cancel">Cancel</button>
        <div v-if="this.editFreetError">{{this.editFreetError}}</div>
    </div>
    <div v-if="refreeting" class="refreet-container">
        <input type="text" v-model="refreetContent" placeholder="New content here">
        <button @click="submitRefreet" :disabled="!refreetContent">Save</button>
        <button @click="cancelRefreet">Cancel</button>
        <div v-if="this.refreetError">{{this.refreetError}}</div>
    </div>
    <p> Freet ID {{freet.freetID}} </p>
    <div v-if="freet.edited" class="edited-text">Edited</div>
  </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";
import Refreet from "./Refreet";

export default {
  name: "Freet",
  components: { Refreet },
  props: ["freet", "user"],
  created: function () {},
  methods: {
    deleteFreet: function () {
      if (confirm('Are you sure you want to delete freet?')) {
        axios.delete("/api/freets/" + encodeURIComponent(this.freet.freetID)).then(() => {
          eventBus.$emit("refresh-freets");
        })
      }
    },
    save: function () {
      axios.put("/api/freets/" + encodeURIComponent(this.freet.freetID), {
        id: this.freet.freetID,
        content: this.newContent
      }).then(() => {
        this.editing = false;
        this.newContent = "";
        this.editFreetError = "";
        eventBus.$emit("refresh-freets");
      }).catch((error) => {
        this.editFreetError = error.response.data.error;
      })
    },
    cancel: function() {
        this.editing = false;
        this.editFreetError = "";
    },
    like: function() {
        axios.patch("/api/freets/" + encodeURIComponent(this.freet.freetID) + "/likes", {
        id: this.freet.freetID,
        userID: this.user.userID
      }).then(() => {
        this.likeError = "";
        eventBus.$emit("refresh-freets");
      }).catch((error) => {
        this.likeError = error.response.data.error;
      })
    },
    unlike: function() {
        axios.delete("/api/freets/" + encodeURIComponent(this.freet.freetID) + "/likes", {
        id: this.freet.freetID,
        userID: this.user.userID
      }).then(() => {
        this.likeError = "";
        eventBus.$emit("refresh-freets");
      }).catch((error) => {
        this.likeError = error.response.data.error;
      })
    },
    liked: function() {
      return this.freet.likes.includes(this.user.userID);
    },
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
    submitRefreet: function () {
      axios.post("/api/freets", {content: this.refreetContent, refreet: this.freet.freetID})
      .then(() => {
        this.refreeting = false;
        this.refreetContent = ""
        this.refreetError = "";
        eventBus.$emit('refresh-freets')
      })
      .catch((error) => {
        this.refreetError = error.response.data.error;
      })
    },

    cancelRefreet: function() {
        this.refreeting = false;
        this.refreetError = "";
    },
  },
  data() {
    return {
      editing: false,
      editFreetError: "",
      newContent: "",
      likeError: "",
      refreeting: false,
      refreetError: "",
      refreetContent: "",
    }
  }
}
</script>

<style scoped>
.editing-container {
  width: auto;
  border: 1px solid black;
  margin-top: 3px;
  padding: 3px;
}
.freet-container {
  width: 450px;
  border: 1px solid black;
  margin-top: 5px;
  padding: 3px;
  margin-left: auto;
  margin-right: auto;
}

.edited-text {
  width: 100%;
  text-align: right;
  font-weight: bold;
}
</style>
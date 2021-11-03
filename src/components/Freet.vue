<template>
  <div>
    <div class="freet-container" :style="{'--freet-color': user.userID===freet.userID ? variables.purple : variables.red }">
      <div class="freet-header">
        <span class="freet-author-text"> @{{freet.author}}:</span>
        <button @click="follow" v-if="this.user && !isFollowing()">Follow</button>
        <button @click="unfollow" v-if="this.user && isFollowing()">Unfollow</button>
      </div>
      <div class="freet-body">
        <p class="freet-body-text">{{freet.content}}</p>
        <Refreet :refreet="freet.refreet" :user="user"></Refreet>
      
        <div v-if="editing" class="editing-container">
            <input type="text" v-model="newContent" placeholder="New content here">
            <button @click="save" :disabled="!newContent">Save</button>
            <button @click="cancel">Cancel</button>
            <div v-if="this.editFreetError">{{this.editFreetError}}</div>
        </div>
        <div v-if="refreeting" class="refreeting-container">
            <input type="text" v-model="refreetContent" placeholder="New content here">
            <button @click="submitRefreet" :disabled="!refreetContent">Save</button>
            <button @click="cancelRefreet">Cancel</button>
            <div v-if="this.refreetError">{{this.refreetError}}</div>
        </div>
      </div>

      <div class="freet-footer">
        <img v-if='this.user && !liked()' class="logo" v-on:click="like" src="../assets/empty-heart.svg"/>
        <img v-else-if='this.user && liked()' class="logo" v-on:click="unlike" src="../assets/filled-heart.svg"/>
        <span v-if="likeError"> {{this.likeError}} </span>
        <span> {{freet.likes.length}} </span>
        <a href="javascript:;" @click="editing=true" v-if="user.userID===freet.userID">Edit freet</a> &nbsp;
        <a href="javascript:;" @click="deleteFreet" v-if="user.userID===freet.userID">Delete freet</a> &nbsp;
        <a href="javascript:;" @click="refreeting=true" v-if="user.userID">Refreet</a>
        <span> Freet ID {{freet.freetID}} </span>
        <span v-if="freet.edited" class="edited-text">Edited</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";
import Refreet from "./Refreet";
import variables from '../variables.scss';

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
      variables: variables,
      editing: false,
      editFreetError: "",
      newContent: "",
      likeError: "",
      refreeting: false,
      refreetError: "",
      refreetContent: "",
      freetColor: "$red", 
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.editing-container {
  width: auto;
  border: 1px solid black;
  margin-top: 3px;
  padding: 3px;
}

.refreeting-container {
  width: auto;
  border: 1px solid black;
  margin-top: 3px;
  padding: 3px;
}

.freet-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 450px;
  border: 7.5px solid var(--freet-color);
  border-radius: 20px;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  background-color: var(--freet-color);
}

.edited-text {
  width: 100%;
  text-align: right;
  font-weight: bold;
}

.freet-header {
  display: flex;
  justify-content: space-between;
  height: 20px;
  width: 100%;
}

.freet-author-icon {
  margin: 0px;
  width: 0px;
  height: 20px;
  width: 20px;
  font-weight: bold;
  color: $red;
  background: white;
  border-radius: 10px;
}

.freet-author-text {
  margin: 0px;
  padding: 0px;
  font-weight: bold;
  color: white;
}

.freet-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  min-height: 60px;
  width: 100%;
  padding: 10px 0 0 0;
  border-radius: 10px;
}

.freet-body-text {
  display: flex;
  justify-content: flex-start;
  width: 90%;
  margin: 0px;
  padding: 0px;
  font-weight: bold;
  color: black;
}

.freet-footer {
  height: 20px;
}

.logo {
    width: 15px;
    height: 15px;
    margin: 0px 2px 0px 2px;
    cursor: pointer;
  }
</style>
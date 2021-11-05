<template>
  <div>
    <Freet
      :freet="freet" 
      :user="user" 
      :type="'chain'">
    </Freet>
    <div class="children-container">
      <div class="children-left-bar"></div>
      <div class="children-display">
        <RefreetChain 
          v-for="refreet of freet.children.filter((child) => child != 'deleted')"
          :key="refreet.id"
          :freet="refreet" 
          :user="user">
        </RefreetChain>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";
import Freet from './Freet';
import variables from '../variables.scss';

export default {
  name: "RefreetChain",
  components: { Freet },
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
    getRefreetChain: function() {
      eventBus.$emit('show-refreet-chain', { id: this.freet.freetID })
    }
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

.children-container {
  display: flex;
  flex-direction: row;
}

.children-left-bar {
  position: relative;
  left: 50px;
  height: auto;
  width: 10px;
  background-color: $purple;
}

.children-display {
  position: relative;
  left: 25px;
  display: flex;
  flex-direction: column;
}

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
  width: 500px;
  border: 7.5px solid var(--freet-color);
  border-radius: 20px;
  margin-top: 20px;
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

}

.logo {
    width: 15px;
    height: 15px;
    margin: 0px 2px 0px 2px;
    cursor: pointer;
  }
</style>
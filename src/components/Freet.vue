<template>
  <div class="freet-container" :style="style">
    <div v-if="freet != 'deleted'" class="freet-header">
      <span class="interaction-container">
        <span class="author-container">
          <InteractiveIcon
            :handler="viewProfile"
            :hovertext="'View Profile'">
            <template v-slot:image>
              <span class="user-icon">
                {{freet.author[0].toUpperCase()}}
              </span>
              <p class="interactive">
                @{{ freet.author }}
              </p>
            </template>
          </InteractiveIcon>
        </span>
        <template v-if="type=='complex'">
          <p>&nbsp;</p>
          <InteractiveIcon v-if="user && !isFollowing"
            :handler="follow"
            :hovertext="'Follow'">   
            <template v-slot:image><img class="icon interactive-icon" src="../assets/follow-empty.svg" /></template>
          </InteractiveIcon>
          <InteractiveIcon v-if="user && isFollowing"
            :handler="unfollow"
            :hovertext="'Unfollow'">   
            <template v-slot:image><img class="icon interactive-icon" src="../assets/follow-filled.svg" /></template>
          </InteractiveIcon>
        </template>
      </span>
      <span class="interaction-container">
        <button v-if="type=='complex' || type=='chain'" v-on:click="getRefreetChain">Refreets</button>
      </span>
    </div>
    <div class="freet-body">
      <p v-if="freet=='deleted'">This refreeted freet was deleted.</p>
      <textarea 
        class="postComment"
        maxlength="140"
        v-model = 'message'
        :id="`postComment-${this.freet.id}`"
        :disabled = '!this.editing'
        @input='onTextInput'
        @blur="submitEditedFreet($event)"
        @keydown.enter.exact="$event.target.blur()">
      </textarea>
      <div v-if="['complex'].includes(type)" class="refreet-container">
        <Freet
          v-if="freet.refreet"
          :freet="freet.refreet" 
          :user="user" 
          :type="'refreet'"/>
        <span v-if="freet.edited" class="edited-text">Edited</span>
      </div>
      <div v-else-if="type=='refreet' && freet.refreet" class="refreet-container">
        This freet is a refreet of another freet.
      </div>
    </div>

    <div v-if="freet != 'deleted'" class="freet-footer">
      <template v-if="type != 'refreet' && type != 'chain'">
        <span class="likes-container">
          <template v-if="user">
            <InteractiveIcon v-if="liked"
              :handler="unlike"
              :hovertext="'Unlike'">   
              <template v-slot:image><img class="icon interactive-icon" src="../assets/filled-heart.svg" /></template>
            </InteractiveIcon>
            <InteractiveIcon v-else
              :handler="like"
              :hovertext="'Like'">   
              <template v-slot:image><img class="icon interactive-icon" src="../assets/empty-heart.svg" /></template>
            </InteractiveIcon>
          </template>
          <img v-else class="icon" src="../assets/empty-heart.svg" />
          <p class="likes-text"> {{freet.likes.length}} </p>
        </span>
        <span class="interaction-container">
          <InteractiveIcon v-if="ownFreet"
            :handler="enableEdit"
            :hovertext="'Edit'">   
            <template v-slot:image><img class="icon interactive-icon" src="../assets/edit.svg" /></template>
          </InteractiveIcon>
          <InteractiveIcon v-if="ownFreet"
            :handler="deleteFreet"
            :hovertext="'Delete'">   
            <template v-slot:image><img class="icon interactive-icon" src="../assets/trash.svg" /></template>
          </InteractiveIcon>
          <InteractiveIcon v-if="user"
            :handler="enableRefreet"
            :hovertext="'Refreet'">   
            <template v-slot:image><img class="icon interactive-icon" src="../assets/refreet.svg" /></template>
          </InteractiveIcon>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";
import variables from "../variables.scss";
import InteractiveIcon from "./InteractiveIcon";

export default {
  name: "Freet",
  components: { InteractiveIcon },
  props: ["freet", "user", "type", "hide"],
  data() {
    return {
      variables: variables,
      editing: false,
      editFreetError: "",
      message: "",
      likeError: "",
      ownFreetTypeColors: {
        'complex': variables.purple,
        'refreet': variables.lightPurple,
        'chain': variables.purple,
      },
      otherFreetTypeColors: {
        'complex': variables.red,
        'refreet': variables.lightRed,
        'chain': variables.red,
      },
      freetTypeWidths: {
        'complex': '100%',
        'refreet': '100%',
        'chain': '100%',
      }
    }
  },
  computed: {
    ownFreet() {
      return this.user && this.freet && this.user.userID===this.freet.userID;
    },
    freetColor() {
      if (this.ownFreet) {
        return this.ownFreetTypeColors[this.type]
      } else {
        return this.otherFreetTypeColors[this.type];
      }
    },
    freetWidth() {
      return this.freetTypeWidths[this.type];
    },
    style () {
      return {'--freet-color': this.freetColor, '--freet-width': this.freetWidth}
    },
    defaultRefreet() {
      return {
        'content': "",
        'author': this.user.username,
        'edited': false,
        'freetID': undefined,
        'likes': [],
        'refreet': this.freet,
        'refreetedBy': [],
        'userID': this.user.userID,
      }
    },
    liked() {
      return this.user && this.freet.likes.includes(this.user.userID);
    },
    isFollowing() {
        return this.user && this.user.following.includes(this.freet.userID);
    },
  },
  created: function () {
    this.message = this.freet.content;
  },
  methods: {
    onTextInput () {
      // textarea scaling code from https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
      const box = document.getElementById(`postComment-${this.freet.id}`);
      this.setPostContentHeight(0);
      this.$nextTick(() => 
        this.setPostContentHeight(box.scrollHeight)
      );
    },

    enableEdit() {
      this.editing = true;
    },
    enableRefreet() {
      eventBus.$emit('start-refreet', this.freet);
    },
    viewProfile() {
      this.$router.push({ name: 'Profile', params: { username: this.freet.author } });
    },

    deleteFreet() {
      if (confirm('Are you sure you want to delete freet?')) {
        axios.delete("/api/freets/" + encodeURIComponent(this.freet.freetID)).then(() => {
          eventBus.$emit("refresh-freets");
        })
      }
    },
    submitEditedFreet() {
      this.editing = false;
      axios.put("/api/freets/" + encodeURIComponent(this.freet.freetID), {
        id: this.freet.freetID,
        content: this.message,
      }).then(() => {
        this.editFreetError = "";
        eventBus.$emit("refresh-freets");
      }).catch((error) => {
        this.message = this.freet.content;
        this.editFreetError = error.response.data.error;
      })
    },
    cancel () {
      this.editFreetError = "";
    },
    like () {
        axios.patch("/api/freets/" + encodeURIComponent(this.freet.freetID) + "/likes", {
        id: this.freet.freetID,
        userID: this.user.userID
      }).then(() => {
        this.likeError = "";
        eventBus.$emit("refresh-freets");
      }).catch((error) => {
        this.likeError = error.response.data.error;
        alert(this.likeError);
      })
    },
    unlike () {
      axios.delete(`/api/freets/${encodeURIComponent(this.freet.freetID)}/likes`, {
        id: this.freet.freetID,
        userID: this.user.userID
      }).then(() => {
        this.likeError = "";
        eventBus.$emit("refresh-freets");
      }).catch((error) => {
        this.likeError = error.response.data.error;
        alert(this.likeError);
      })
    },
    follow () {
      axios.patch(`/api/users/${encodeURIComponent(this.freet.userID)}/following`).then(() => {
        eventBus.$emit("refresh-freets");
        eventBus.$emit("refresh-user");
      }).catch((error) => {
        console.log(error);
      })
    },
    unfollow () {
      axios.delete(`/api/users/${encodeURIComponent(this.freet.userID)}/following`).then(() => {
        eventBus.$emit("refresh-freets");
        eventBus.$emit("refresh-user");
      }).catch((error) => {
        console.log(error);
      })
    },
    getRefreetChain () {
      eventBus.$emit('show-refreet-chain', this.freet.freetID);
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

textarea {
  background: white;
  color: blueviolet;
  text-align: left;
  width: 90%;
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

.likes-container {
  display: flex;
  flex-direction: row;
  margin: 0px;
  height: 20px;
}

.interaction-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

section {
  border: 1px solid;  
  background: white;
  outline: solid white;
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  padding: 25px;
}

.freet-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: calc(var(--freet-width) - 2 * 37.5px);
  border: 7.5px solid var(--freet-color);
  border-radius: 20px;
  margin: 10px 30px 10px 30px;
  background-color: var(--freet-color);
}

.refreet-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.edited-text {
  text-align: right;
  font-weight: bold;
}

.freet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 35px;
  padding-bottom: 5px;
}

.freet-author-icon {
  height: 20px;
  width: 20px;
  font-weight: bold;
  color: $red;
  background: white;
  border-radius: 10px;
  margin: 2px;
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
  width: calc(100% - 2 * 10px);
  padding: 10px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px;
}

.icon {
  margin: 2px;
  width: 20px;
  height: 20px;
  margin: 0px 2px 0px 2px;
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(234deg) brightness(107%) contrast(102%);
}

.icon:hover {
  filter: invert(80%) sepia(71%) saturate(1171%) hue-rotate(109deg) brightness(100%) contrast(100%);
}

button {
  font-size: 20px;
  height: 28px;
  margin: 0;
  border-radius: 5px;
  padding: 0 5px;
}

p {
  line-height: 15px;
  text-align: center;
  font-size: 20px;
  color: white;
  font-family: 'Rowdies', Courier, monospace;
  text-decoration: none;
  margin: auto;
}

.user-icon {
  color: var(--freet-color);
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

.author-container {
  display: flex;
  flex-direction: row;
}

.author-container:hover .user-icon {
  background: $light-blue;
  cursor: pointer;
}
.author-container:hover .interactive {
  color: $light-blue;
  cursor: pointer;
}


</style>
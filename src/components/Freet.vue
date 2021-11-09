<template>
  <div class="freet-container" :style="style">
    <div v-if="freet != 'deleted'" class="freet-header">
      <span class="freet-author-text"> @{{freet.author}}:</span>
      <span>
        <button v-on:click="getRefreetChain">Refreets</button>
        <template v-if="type == 'complex'">
          <button v-on:click="follow" v-if="this.user && !isFollowing()">Follow</button>
          <button v-on:click="unfollow" v-if="this.user && isFollowing()">Unfollow</button>
        </template>
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
        @keydown.enter.exact.prevent="$event.target.blur()">
    </textarea>
      <div v-if="type == 'complex'" class="refreet-container">
        <Freet
          v-if="freet.refreet"
          :freet="freet.refreet" 
          :user="user" 
          :type="'refreet'">
        </Freet>

        <div v-if="refreeting" class="refreeting-container">
          <section>
            <input type="text" v-model="refreetContent" placeholder="New content here">
            <button @click="submitRefreet" :disabled="!refreetContent">Save</button>
            <button @click="cancelRefreet">Cancel</button>
            <div v-if="this.refreetError">{{this.refreetError}}</div>
          </section>
        </div>

        <span v-if="freet.edited" class="edited-text">Edited</span>
      </div>
      <div v-else-if="type=='refreet' && freet.refreet" class="refreet-container">
        This freet contains a refreet.
      </div>
    </div>

    <div v-if="freet != 'deleted'" class="freet-footer">
      <template v-if="type=='complex' || type=='chain'">
        <span class="likes-container">
          <template v-if="user">
            <InteractiveIcon v-if="liked()"
              :handler="unlike"
              :hovertext="'Unlike'">   
              <template v-slot:image><img class="interactive-icon" src="../assets/filled-heart.svg" /></template>
            </InteractiveIcon>
            <InteractiveIcon v-else
              :handler="like"
              :hovertext="'Like'">   
              <template v-slot:image><img class="interactive-icon" src="../assets/empty-heart.svg" /></template>
            </InteractiveIcon>
          </template>
          <img v-else class="logo" src="../assets/empty-heart.svg" />
          <span> {{freet.likes.length}} </span>
        </span>
        <span class="interaction-container">
          <InteractiveIcon v-if="ownFreet"
            :handler="enableEdit"
            :hovertext="'Edit'">   
            <template v-slot:image><img class="interactive-icon" src="../assets/edit.svg" /></template>
          </InteractiveIcon>
          <InteractiveIcon v-if="ownFreet"
            :handler="deleteFreet"
            :hovertext="'Delete'">   
            <template v-slot:image><img class="interactive-icon" src="../assets/trash.svg" /></template>
          </InteractiveIcon>
        </span>
        <InteractiveIcon v-if="user"
          :handler="enableRefreet"
          :hovertext="'Refreet'">   
          <template v-slot:image><img class="interactive-icon" src="../assets/refreet.svg" /></template>
        </InteractiveIcon>
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
  props: ["freet", "user", "type"],
  data() {
    return {
      variables: variables,
      editing: false,
      editFreetError: "",
      message: "",
      likeError: "",
      refreeting: false,
      refreetError: "",
      refreetContent: "",
      ownFreetTypeColors: {
        'complex': variables.purple,
        'refreet': variables.lightPurple,
        'chain': variables.purple,
        'editing': variables.purple,
      },
      otherFreetTypeColors: {
        'complex': variables.red,
        'refreet': variables.lightRed,
        'chain': variables.red,
        'editing': variables.red,
      },
      freetTypeWidths: {
        'complex': '100%',
        'refreet': '100%',
        'chain': '100%',
        'editing': '500px',
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
    }
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
      this.refreeting = true;
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
    hideChild () {
      this.editing = false;
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
        axios.delete("/api/freets/" + encodeURIComponent(this.freet.freetID) + "/likes", {
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
}

.interaction-container {
  display: flex;
  flex-direction: row;
}

.refreeting-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  border: 1px solid black;
  margin-top: 3px;
  padding: 3px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: rgba(100, 100, 100, 0.5);
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
  width: 90%;
}

.edited-text {
  text-align: right;
  font-weight: bold;
}

.freet-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 35px;
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
  width: 100%;
}

.logo {
  width: 20px;
  height: 20px;
  margin: 0px 2px 0px 2px;
}

button {
  font-size: 20px;
  height: 28px;
  margin: 0;
  border-radius: 5px;
  padding: 0 5px;
}


</style>
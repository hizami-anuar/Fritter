<template>
<div>
  <div class="big-window" v-on:click.prevent="hideAccountSettings">
  </div>
  <div class="popup-window">
        <h2>Settings</h2>
        <div>
            <label for="newUsername">Change username: </label>
            <input type="text" name="newUsername" placeholder="new username" v-model="newUsername" />
            <input type="submit" @click="changeUsername" value="Change Username"/>
            <div v-if="changeUsernameError">
                {{changeUsernameError}}
            </div>
        </div>
        <div>
            <div>
                <label for="newPassword1">Enter new password:</label>
                <input type="password" id="newPassword1" name="newPassword1" v-model="newPassword1">
            </div>
            <div>
                <label for="newPassword2">Enter password again:</label>
                <input type="password" id="newPassword2" name="newPassword2" v-model="newPassword2">
            </div>
            <input type="submit" @click="changePassword" value="Change Password"/>
            <div v-if="changePasswordError">
                {{changePasswordError}}
            </div>
        </div>

        <input type="submit" @click="deleteUserAccount" value="Delete Account"/>
        
        <input
                class="closeButton"
                type="submit"
                value="Close"
                v-on:click.prevent="hideAccountSettings"
            />
    </div>
</div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";

export default {
  name: "AccountSettings",
  components: {},
  props: ["user"],
  data() {
    return {
        searchResults: [],
        invalidFreet: false,
        newUsername: "",
        changeUsernameError: "",
        newPassword1: "",
        newPassword2: "",
        changePasswordError: "",
    };
  },
  created: function() {
  },
  methods: {
    hideAccountSettings() {
        eventBus.$emit("hide-account-settings")
    },
    changeUsername () {
      axios.put(`/api/users/${encodeURIComponent(this.user.username)}/edit`, {
        username: this.newUsername
      }).then(() => {
        eventBus.$emit("refresh-user")
        eventBus.$emit("refresh-freets")
        this.changeUsernameError = "";
        alert("You have successfully changed your username");
      }).catch((error) => {
        this.changeUsernameError = error.response.data.error;
      })
    },
    changePassword () {
      if (this.newPassword1 !== this.newPassword2) {
        this.changePasswordError = "your passwords dont match!";
        return;
      }
      axios.put(`/api/users/`, {
        password: this.newPassword1
      }).then(() => {
        this.changePasswordError = "";
        alert("You have successfully changed your password");
      }).catch((error) => {
        this.changePasswordError = error.response.data.error;
      })
    },
    deleteUserAccount() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone and your Freets will be permanently deleted.')) {
        axios.delete("/api/users").then(() => {
          eventBus.$emit("refresh-freets");
          eventBus.$emit("user-logout-success");
          this.hideAccountSettings()
        }).catch((error) => {
          console.log(error);
        })
      }
    },
  },
};
</script>

<style>
.big-window {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color:  rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  z-index: 5 !important;
}
.popup-window {
  position: relative;
  background-color: rgba(255, 255, 255, 0.3);
  height: fit-content;
  max-height: 400px;
  overflow-y: auto;
  width: 200px;
  padding: 5px 10px 10px 5px;
  margin-top: calc(50vh - 200px);
  border-style: solid;
  border-color: white;
  border-width: 2px;
  border-radius: 10px;
  color: white;
  animation: popIn;
  animation-duration: 0.1s;
  font-family: "Quicksand";
  z-index: 99999 !important;
}

.closeButton {
  position: 'absolute';
  padding: 100; 
  background-color:  rgba(255, 255, 255, 0.3);
  align-content: center;
  border-radius: 5px;
  font-family: "Quicksand"
}
</style>
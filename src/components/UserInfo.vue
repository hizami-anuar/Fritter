<template>
  <div class="userInfo">
    <div class="userInfoGroup">
      <h3>New Username:</h3>
      <input type="text" id="username" v-model="username">
      <p 
        :class="usernameFeedback.type"
        v-if="usernameFeedback.message">
        {{ usernameFeedback.message }}</p>
      <form id="changeUsername" v-on:submit.prevent="changeUsername">
        <input
          type="submit"
          value="update my username"
          class="button"
          :disabled="username.length === 0"
          v-on:click.prevent="changeUsername"
        />
      </form>
    </div>

    <div class="userInfoGroup">
      <h3>New Password:</h3>
      <input :type=visibility id="password" v-model="password">
      <img alt="password toggle" src="../assets/eye.png" class="eye" v-on:click.prevent="toggleVisibility">
      <p 
        :class="passwordFeedback.type"
        v-if="passwordFeedback.message">
        {{ passwordFeedback.message }}</p>
      <form id="changePassword" v-on:submit.prevent="changePassword">
        <input
          type="submit"
          value="update my password"
          class="button"
          :disabled="password.length === 0"
          v-on:click.prevent="changePassword"
        />
      </form>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: 'UserInfo',
  data: function () {
    return {
      username: '',
      password: '',
      usernameFeedback: {
        type: '',
        message: '',
      },
      passwordFeedback: {
        type: '',
        message: '',
      },
      visibility: "password",
    };
  },
  methods: {
    /**
     * Changes the username of the currently active user. Displays error or success
     * message depending on the whether the put request was executed successfully.
     */
    changeUsername() {
      axios
        .put('/api/users/username', {'username': this.username})
        .then(async () => {
          this.usernameFeedback = {
            type: "success",
            message: "Username changed successfully!",
          };
          eventBus.$emit("user-change-event", {mode: 'CHANGE', param: 'username', value: this.username});
          eventBus.$emit("name-change", this.username);
          this.username = '';
        })
        .catch(error => {
          this.usernameFeedback = {
            type: "error",
            message: error.response.data.error,
          };
          this.username = '';
        })
    },
    /**
     * Changes the password of the currently active user. Displays error or success
     * message depending on the whether the put request was executed successfully.
     */
    changePassword() {
      axios
      .put('/api/users/password', {'password': this.password})
      .then(() => {
        this.passwordFeedback = {
          type: "success",
          message: "Password changed successfully!",
        };
        this.password = '';
      })
      .catch(error => {
        this.passwordFeedback = {
          type: "error",
          message: error.response.data.error,
        };
        this.password = '';
      })
    }, 
    /**
     * Toggle eye icon to either hide the currently typed password or show it in plaintext.
     */
    toggleVisibility() {
      this.visibility = this.visibility === 'password'? 'text': 'password';
    }
  }
}
</script>

<style scoped>
  .userInfo {
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    margin: 0 20px;
  }

  .userInfoGroup {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }

  .eye {
    width: 8%;
    margin: 5px;
  }

  .error {
    color: red;
  }

  .success {
    color: green;
  }

  input {
    font-size: 20px;
  }

  .button:disabled {
    pointer-events: none; 
    background-color: #edf1f2;
    color: grey;
  }
</style>
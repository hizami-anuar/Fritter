<template>
  <div>
    <form id="login">
      <h3>Login here</h3>
      <div>
          <label for="username">username:</label>
          <input type="text" id="username" name="username" v-model="username">
      </div>
      <div>
          <label for="password">password:</label>
          <input type="password" id="password" name="password" v-model="password">
      </div>
      <input
        type="submit"
        value="Login"
        v-on:click.prevent="login"
      />
      <div v-if="passwordIncorrect">
          {{this.loginFailMessage}}
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";

export default {
  name: "Login",
  props: [],
  data() {
    return {
        username: "", 
        password: "",
        passwordIncorrect: false,
        loginFailMessage: ""
    };
  },
  created: function() {},
  methods: {
    login() {
      axios.post("/api/session", {username: this.username, password: this.password})
      .then((response) => {
        eventBus.$emit("user-login-success", {
            username: response.data.username, 
            userID: response.data.userID,
            following: response.data.following
        })
      })
      .catch((error) => {
        this.passwordIncorrect = true;
        this.loginFailMessage = error.response.data.error;
      })
    },
  },
};
</script>

<style></style>

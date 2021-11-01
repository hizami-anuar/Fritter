<template>
  <div>
    <form id="newAccount">
      <h3>Create a new account!</h3>
      <div>
          <label for="username">username:</label>
          <input type="text" id="username" name="username" v-model="username">
      </div>
      <div>
          <label for="password1">Enter password:</label>
          <input type="password" id="password1" name="password1" v-model="password1">
      </div>
      <div>
          <label for="password2">Enter password again:</label>
          <input type="password" id="password2" name="password2" v-model="password2">
      </div>
      <input
        type="submit"
        value="Create account"
        v-on:click.prevent="createAccount"
      />
      <div v-if="errorStatus">
          {{errorMsg}}
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
        password1: "",
        password2: "",
        errorStatus: false,
        errorMsg: ""
    };
  },
  created: function() {},
  methods: {
    createAccount() {
      if (this.password1 !== this.password2) {
        this.errorMsg = "your passwords dont match!";
        this.errorStatus = true;
        return;
      }
      axios.post("/api/users", {username: this.username, password: this.password1})
        .then((response) => {
            eventBus.$emit("user-login-success", {
                username: response.data.username, 
                userID: response.data.userID,
                following: response.data.following
            })
        })
        .catch((error) => {
            this.errorStatus = true;
            this.errorMsg = error.response.data.error;
        })
    },
  },
};
</script>

<style></style>

<template>
  <div>
    <div class="signup" v-if="isSigningIn">
      <section>
        <div v-if="tab===0">
        </div>
        
        <h4>Username:</h4><input type="text" id="username" placeholder="username" v-model="username">
        <h4>Password:</h4><input :type=visibility placeholder="password" id="password" v-model="password">
        <img alt="password toggle" src="../assets/eye.png" class="eye" v-on:click.prevent="toggleVisibility">
        <p>{{this.errorMessage}}</p>
        
        <form id="createAccount" v-on:submit.prevent="createAccount">
          <input
            type="submit"
            value="Create Account"
            class="button"
            v-on:click.prevent="createAccount"
          />
        </form>
        <form id="logIn" v-on:submit.prevent="logIn">
          <input
            type="submit"
            value="Log In"
            class="button"
            v-on:click.prevent="logIn"
          />
        </form>
        <button @click='cancelRequiredLogin'> Close </button>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: 'Signup',
  data() {
    return {
      tab: 0,
      isSigningIn: false,
      cancelDest: null,
      username: '',
      password: '',
      errorMessage: '',
      visibility: 'password', // to show or hide the currently typed password
    };
  },
  mounted() {
    /** 
     * Force login popup and redirect close button to Home
     */
    eventBus.$on('show-login', (cancelDest=null) => {
       this.cancelDest = cancelDest;
       this.activate();
    });

    /** 
     * Force create account popup and redirect close button to Home
     */
    eventBus.$on('show-create-account', (cancelDest=null) => {
       this.cancelDest = cancelDest;
       this.activate();
    });
  },
  methods: {
    /**
     * Create an account and logs the user in if the create account was successful.
     * Otherwise, display a localized error message.
     */
    createAccount() {
        axios
        .post('/api/users/', {'username': this.username, 'password': this.password})
        .then((response) => {
          eventBus.$emit('user-login-success', response.data);
          this.deactivate();
        })
        .catch(error => {
            this.errorMessage = error.response.data.error;
        })
    },

    /**
     * Logs in the user and opens up the pop up window by emitting the event and shows error message
     * if log in was not successful.
     */
    logIn() {
        axios
        .post('/api/session/', {'username': this.username, 'password': this.password})
        .then((response) => {
            eventBus.$emit('user-login-success', response.data);
            this.deactivate();
        })
        .catch(error => {
            this.errorMessage = error.response.data.error;
        })
    },
    /**
     * Open the pop up when the login button is clicked or login is required.
     */
    activate() {
      this.isSigningIn = true;
    },
    /**
     * Close it when logged in successfully or when canceled
     */
    deactivate() {
      this.isSigningIn = false;
    },
    /**
     * Close and redirect when required login is canceled
     */
    cancelRequiredLogin() {
      this.deactivate();
      if (this.cancelDest) {
        this.$router.push(this.cancelDest);
      }
    },
    /**
     * Toggle the visibility of the passwords to either show or in plain text.
     */
    toggleVisibility() {
      this.visibility = this.visibility === 'password'? 'text': 'password';
    }
  }
}
</script>

<style scoped>
    .eye {
      width: 8%;
    }
    .signup {
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
      width: 400px;
      height: 500px;
      position: absolute;
      left: calc(50% - 200px);
      top: calc(50% - 250px);
      align-items: center;
      padding: 25px;
    }
    p {
      color: red
    }

    a {
      margin: 0 10px;
    }
</style>
<template>
  <div class="container" v-if='isSigningIn'>
    <div class="signup">
      <img src="../assets/close.svg" class="closeButton" @click='cancelRequiredLogin'/>
      <section class="tabLinkContainer">
        <h3 class="tabLink" @click="changeTab(0)" :class="{ active: tab === 0 }">Sign up</h3>
        <h3 class="tabLink" @click="changeTab(1)" :class="{ active: tab === 1 }">Login</h3>
      </section>
      
      <section v-if="tab===0" class="signupInformation">
        <h3>Username:</h3>
        <input type="text" id="username" placeholder="username" v-model="username">
        
        <h3>Password:</h3>
        <div class="passwordField">
          <input :type="visibility['password']" placeholder="password" id="password" v-model="password">
          <img alt="password toggle" src="../assets/eye.png" class="eye" v-on:click.prevent="toggleVisibility('password')">
        </div>

        <h3>Confirm Password:</h3>
        <div class="passwordField">
          <input :type="visibility['confirmPassword']" placeholder="password" id="confirmPassword" v-model="confirmPassword">
          <img alt="password toggle" src="../assets/eye.png" class="eye" v-on:click.prevent="toggleVisibility('confirmPassword')">
        </div>
        
        <p>{{this.errorMessage}}</p>
      
      </section>

      <section v-if="tab===1" class="signupInformation">
        <h3>Username:</h3>
        <input type="text" id="username" placeholder="username" v-model="username">

        <h3>Password:</h3>
        <div class="passwordField">
          <input :type="visibility['password']" placeholder="password" id="password" v-model="password">
          <img alt="password toggle" src="../assets/eye.png" class="eye" v-on:click.prevent="toggleVisibility('password')">
        </div>
        
        <p>{{this.errorMessage}}</p>
      </section>

      <button v-if="tab === 0" @click="createAccount">Sign up</button>
      <button v-else-if="tab === 1" @click="logIn">Login</button>
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
      confirmPassword: '',
      errorMessage: '',
      visibility: {
        password: "password",
        confirmPassword: "password",
      }
    };
  },
  mounted() {
    /** 
     * Force login popup and redirect close button to Home
     */
    eventBus.$on('show-login', (cancelDest=null) => {
      this.cancelDest = cancelDest;
      this.tab = 1;
      this.activate();
    });

    /** 
     * Force create account popup and redirect close button to Home
     */
    eventBus.$on('show-create-account', (cancelDest=null) => {
      this.cancelDest = cancelDest;
      this.tab = 0;
      this.activate();
    });
  },
  methods: {
    /**
     * Changes tab to either 0 (create account) or 1 (login)
     */
    changeTab(tab) {
      this.tab = tab;
      this.errorMessage = "";
    },

    /**
     * Create an account and logs the user in if the create account was successful.
     * Otherwise, display a localized error message.
     */
    createAccount() {
        if (this.password != this.confirmPassword) {
          this.errorMessage = "Passwords do not match!"
          return;
        }

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
    toggleVisibility(item) {
      this.visibility[item] = this.visibility[item] == "password"? "text": "password";
    }
  }
}
</script>

<style scoped>
  .container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: rgba(100, 100, 100, 0.5);

    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tabLinkContainer {
    display: flex;
  }

  .passwordField {
    display: flex;
    align-content: center;
    justify-content: flex-start;
  }
  .closeButton {
    align-self: flex-end;
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(98deg) brightness(106%) contrast(101%);
  }

  .tabLink {
    margin: 5px;
  }

  .tabLink.active {
    color: var(--light-blue);
  }

  .eye {
    margin-left: 5px;
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(98deg) brightness(106%) contrast(101%);
    width: 25px;
  }

  .tabLink:hover {
    cursor: pointer;
  }

  .eye:hover {
    cursor: pointer;
  }

  .closeButton:hover {
    cursor: pointer;
  }

  input {
    border-radius: 5px;
    border: none;
    height: 20px;
  }

  .signupInformation {
    width: 250px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .signup {
    z-index: 2;
    color: white;
    background: var(--purple);
    outline: solid var(--purple);
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 450px;
    position: absolute;
    left: calc(50% - 200px);
    top: calc(50% - 250px);
    align-items: center;
    padding: 25px;
  }
  
  p {
    color: var(--light-red);
  }

  a {
    margin: 0 10px;
  }

  button {
    font-size: 20px;
    height: 28px;
    margin: 0;
    border-radius: 5px;
    padding: 0 5px;
  }
</style>
<template>
  <div class="App-container">
    <header>
      <Navbar :user="user"></Navbar>
    </header>
    <div class="Main-container">
      <CreateAccount v-if="showCreateAccount"/>
      <Login v-if="showLogin" />
      <AccountSettings :user="user" v-if="showAccountSettings"/>
      <AllFreets :user="user"></AllFreets>
      <!-- <div v-else>
        <Navbar :user="user"></Navbar>  
      </div> -->
    </div>
  </div>
</template>

<script>
import Login from "../components/Login.vue";
import CreateAccount from "../components/CreateAccount.vue";
import AllFreets from '../components/AllFreets.vue';
import { eventBus } from '../main';
import Navbar from '../components/Navbar.vue';
import AccountSettings from '../components/AccountSettings.vue';
import axios from "axios";

export default {
  name: "app",
  components: { Login, CreateAccount, Navbar, AllFreets, AccountSettings },
  data() {
    return {
      loggedIn: false,
      showAccountSettings: false,
      showLogin: false,
      showCreateAccount: false,
      user: false
    };
  },
  created: function() {
    window.addEventListener('popstate', () => {
      eventBus.$emit("refresh-freets");
    })
    this.refreshSession()
    eventBus.$on("refresh-user", () => {
      this.refreshSession();
    })
    eventBus.$on("user-login-success", (response) => {
      this.loggedIn = true;
      this.user = {
        username: response.username,
        userID: response.userID,
        following: response.following
      };
      this.showLogin = false;
      this.showCreateAccount = false;
      eventBus.$emit("refresh-freets");
    });
    eventBus.$on("show-login", () => {
      this.showLogin = true;
      this.showCreateAccount = false;
    });
    eventBus.$on("show-create-account", () => {
      this.showCreateAccount = true;
      this.showLogin = false;
    });
    eventBus.$on("user-logout-success", () => {
      this.loggedIn = false;
      this.user = false;
      eventBus.$emit("refresh-freets");
    });
    eventBus.$on("show-account-settings", () => {
      this.showAccountSettings = true;
    });
    eventBus.$on("hide-account-settings", () => {
      this.showAccountSettings = false;
    });
  },
  computed: {},
  methods: {
    refreshSession() {
      axios.get('/api/session').then((user) => {
        this.loggedIn = true;
        this.user = user.data
      }).catch(() => {});
    }
  },
};
</script>

<style>
.App-container {
    max-width: 100%;
    width: 100vw;
    height: 98vh;
    /* padding: var(--m) var(--m); */
    /* margin: auto; */
    overflow: hidden;
}

.Main-container {
    width: auto;
    max-width: 50vw;
    margin: auto;
    height: 100%;
    left: 0px;
    top: 0px;

    padding: 0px 24px;

    background: #fafafa;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}
</style>

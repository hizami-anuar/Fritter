<template>
  <div id="app">
    <header>
      <Navbar :user="user" />
    </header>

    <Settings v-if="user" :user="user" />
    <Signup v-else />
    
    <router-view 
      :user="user"
      :key="$route.fullPath"
    />
  </div>
</template>

<script>
import { eventBus } from './main';
import Navbar from './components/Navbar.vue';
import Signup from "./components/Signup.vue";
import Settings from "./components/Settings.vue";
import axios from "axios";

export default {
  name: "app",
  components: { Navbar, Signup, Settings, },
  data() {
    return {
      loggedIn: false,
      showLogin: false,
      showCreateAccount: false,
      showSettings: false,
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
      console.log(response);
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

::-webkit-scrollbar {
    width:10px
}

::-webkit-scrollbar-thumb {
    background: var(--red);
    border-radius: 10px;
}

</style>

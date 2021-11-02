<template>
  <nav class="NavBar-main">
    <img alt="Fritter logo" src="../assets/navlogo.png" class="logo">
    <div class="">
        <h1 class="NavBar-title"> Fritter </h1>
    </div>

    <router-link to="/">Home</router-link> |
    <router-link to="/explore">Explore</router-link>
    <router-link to="/profile" v-if="user">Profile</router-link>

    <div>
      <input type="text" placeholder="Search by author name..." v-model="author"/>
      <input
          type="submit"
          value="Search"
          :disabled="!author"
          v-on:click.prevent="search"
      />
    </div>
    
    <div class="all-menu-items">
        <div v-if="user" class="NavBar-profile-container">Welcome {{user.username}}</div>
        <input
            type="submit"
            value="Login"
            v-if="!user"
            v-on:click.prevent="loginPage"
        />
        <input
            type="submit"
            v-if="!user"
            value="Create New Account"
            v-on:click.prevent="createAccountPage"
        />
        <input
            type="submit"
            v-if="user"
            value="Logout"
            v-on:click.prevent="logout"
        />
      </div>
  </nav>
</template>

<script>
import axios from "axios";
import {eventBus} from "../main";

export default {
  name: "Navbar",
  props: ["user"],
  data() {
    return {
      author: ""
    };
  },
  created: function() {},
  methods: {
    search () {
      if (this.author.includes(" ")) {
        alert('Search term cannot contain whitespaces')
        return;
      }
      eventBus.$emit("search", {
        author: this.author.trim()
      })
    }, 
    login() {
      axios.post("/api/session", {username: this.username, password: this.password})
      .then((response) => {
        eventBus.$emit("user-login-success", {
            username: response.username, 
            userID: response.userID,
            following: response.following
        }).catch((error) => {
          console.log(error);
        })
      })
      .catch(() => {
        this.passwordIncorrect = true 
      })
    },
    loginPage() {
        eventBus.$emit("show-login")
    },
    createAccountPage() {
        eventBus.$emit("show-create-account")
    },
    logout() {
      axios.delete("/api/session")
      .then((response) => {
        eventBus.$emit("user-logout-success", {
            username: response.username, 
            userID: response.userID
        })
      })
      .catch((error) => {
        alert(error.response.data.message);
      })
    },
  },
};
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css2?family=Fjalla+One&family=Major+Mono+Display&family=Manuale&family=Open+Sans&family=Playfair+Display:wght@800&display=swap');
@import '../variables.scss';

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .logo {
    width: 50px;
  }

  nav {
    background-color: lightgray;
    display: flex;
    align-items: center;
    width: calc(100% - 20px);
    padding: 10px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 200;
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
    margin: 10px;
  }

  nav a.router-link-exact-active {
    color: #18b56edb;
  }

  #welcome {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0;
  }

  #welcomeMessage {
    margin: 0 20px;
  }

  .hspacer {
    margin-left: auto;
    margin-right: auto;
  }

  .vspacer {
    height: 100px;
    width: 100%;
  }

.NavBar-container {
  position: relative;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.NavBar-main {
  display: flex;
  padding: 10px;
  margin: 0;
  background-color: $red;
  height: auto;
  width: 100;
  top: 0;
  z-index: 1;
  justify-content: space-between;
  justify-items: center;
  flex-direction: row;
}

.NavBar-title-container {
  /* color: rgb(73, 73, 73); */
  height: auto;
  /* background-color: rgba(255, 255, 255, 0.5); */
  border-radius: 0px 0px 10px 10px;
  text-align: center;
  margin-left: 32px;
  /* border-color: black; */
  z-index: 1;
}
.NavBar-title {
  /* color: rgb(73, 73, 73); */
  color: white;
  font-size: 30px;
  margin: 0px;
  padding: 8px;
  font-family: 'Playfair Display', sans-serif;
}

.NavBar-profile-container {
  text-align: center;
  margin: auto;
  padding: 8px;
}

.logout-button {
  margin-top: 10px;
  margin-right: 10px;
}

.all-menu-items {
  display: flex;
  padding: 10px;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.0);
  height: auto;
  top: 0;
  z-index: 1;
  justify-content: flex-end;
  align-content: center;
  flex-direction: row;
}
  
.menu-item {
  padding: 8px;
  margin: 5px 24px 0px 0px;

  color: white;
  opacity: 1;
  text-decoration: none;
  font-family: 'Fira Sans', sans-serif;
  font-weight: 200;
  letter-spacing: 1px;
  font-size: 15px;
}
</style>

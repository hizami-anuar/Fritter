<template>
  <nav class="NavBar-main">
    <div class="NavBar-section">
      <router-link to="/"> <h1 class="NavBar-title"> Fritter </h1> </router-link>
      <router-link exact-path :to="{ name: 'Home' }" tag="img" :src="require('@/assets/home.svg')" class="NavBar-icon"> Home </router-link>
      <router-link exact-path :to="{ name: 'Explore' }" tag="img" :src="require('@/assets/explore.svg')" class="NavBar-icon"></router-link>
      <router-link exact-path :to="{ name: 'Profile' }" tag="img" :src="require('@/assets/profile.svg')" class="NavBar-icon" v-if="user">Profile</router-link>
    </div>
    
    <div class="NavBar-section NavBar-middle">
      <div class=NavBar-dropdown>
        <input 
          @focus="showDropdown"
          @blur="hideDropdown"
          type="text" 
          placeholder="Search by author name..." 
          v-model="author" 
          class="NavBar-searchBar"/>
        <SearchDropdown :users="filteredUsers" />
      </div>
      <input class="NavBar-icon NavBar-searchBarButton"
        type="image"
        value="Search"
        :src="require('@/assets/search.svg')"
        :disabled="!author"
        v-on:click.prevent="search"
      />   
    </div>
    
    <div class="NavBar-section NavBar-end">
        <div v-if="user" class="NavBar-profile-container">Welcome, {{user.username}}</div>

        <CreatePost :user='user' v-if="user">
          <button class="createButton">
            Create
            <img class="NavBar-icon create-icon" src="../assets/create.svg">
          </button>
        </CreatePost>

        <button v-if="!user" v-on:click="loginPage"> Login </button>
        <PersonalDropdown v-if="user"
          :user="user"
          />
      </div>
  </nav>
</template>

<script>
import CreatePost from './CreatePost.vue';
import SearchDropdown from'./SearchDropdown.vue';
import PersonalDropdown from'./PersonalDropdown.vue';

import axios from "axios";
import {eventBus} from "../main";

export default {
  name: "Navbar",
  props: ["user"],
  components: { CreatePost, SearchDropdown, PersonalDropdown },
  computed: {
    filteredUsers () {
      let filtered = this.users.filter((user) => user.startsWith(this.author))
      return filtered.slice(0, 5);
    }
  },
  data() {
    return {
      author: "",
      users: [],
    };
  },
  mounted: function() {
    this.getUsers();

    eventBus.$on("refresh-user", () => {
      this.getUsers();
    })
  },
  methods: {
    showDropdown () {
      eventBus.$emit('show-dropdown');
    },
    hideDropdown () {
      eventBus.$emit('hide-dropdown');
    },
    getUsers () {
      axios.get("/api/users")
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
    },
    search () {
      if (this.author.includes(" ")) {
        alert('Search term cannot contain whitespaces')
        return;
      }
      this.$router.push({ name: 'Profile', params: { username: this.author.trim() } });
    },
    loginPage() {
        eventBus.$emit("show-login")
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
    showSettings() {
      eventBus.$emit('show-settings');
    }
  },
};
</script>

<style scoped>
  .logo {
    width: 50px;
  }

  nav {
    background-color: var(--red);
    display: flex;
    align-items: center;
    width: 100vw;
    padding: 10px;
    box-sizing: border-box;
    left: 0;
    top: 0;
  }

  nav a {
    text-decoration: none;
  }

  .NavBar-icon {
    height: 40px;
    width: 40px;
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(234deg) brightness(107%) contrast(102%);
    margin: 0 10px;
  }

  .create-icon {
    height: 30px;
    width: 30px;
    margin: 0 0 0 5px;
    filter: invert(84%) sepia(42%) saturate(336%) hue-rotate(110deg) brightness(105%) contrast(104%);
  }

  .NavBar-icon:hover {
    cursor: pointer;
  }

  .NavBar-icon.router-link-exact-active {
    filter: invert(84%) sepia(42%) saturate(336%) hue-rotate(110deg) brightness(105%) contrast(104%);
  }

  .NavBar-main {
    display: flex;
    padding: 5px;
    margin: 0;
    background-color: var(--red);
    height: 75px;
    width: 100%;
    top: 0;
    justify-content: space-between;
    justify-items: center;
    flex-direction: row;
  }

  .NavBar-title {
    color: white;
    font-size: 30px;
    margin: 0px;
    padding: 8px;
    font-family: 'Playfair Display', sans-serif;
  }

  .NavBar-profile-container {
    font-family: 'Rowdies', Courier, monospace;
    font-size: var(--s);
    color: var(--white);
    text-align: center;
    margin: 0 0 0 auto;
    padding: 8px;
  }

  .logout-button {
    margin-top: 10px;
    margin-right: 10px;
  }

  .createButton {
    margin: 10px;
    height: 45px;
    font-size: 30px;
    display: flex;
    align-items: center;
  }

  .NavBar-searchBar {
    border-color: none;
    border-style: solid;
    border-color: white;
    font-family: 'Rowdies', Courier, monospace;
    font-size: 12pt;
    border-radius: 10px;
    height: 30px;
    width: 250px;
    margin-left: 40px;
  }

  .NavBar-searchBar:focus {
    outline: none;
  }

  .NavBar-searchBarButton {
    width: 30px;
    height: 30px;
    margin: 0 10px;
  }

  .NavBar-searchBarButton:disabled {
    cursor: auto;
    filter: invert(80%) sepia(52%) saturate(6428%) hue-rotate(313deg) brightness(170%) contrast(95%);
  }

  .NavBar-section {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .NavBar-middle {
    justify-content: center;
  }

  .NavBar-end {
    justify-content: flex-end;
  }
</style>

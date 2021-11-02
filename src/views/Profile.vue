<template>
  <div class="profile" v-if="freets !== null">
    <div class="profileLabel">
      <h1>
        {{user.username===profileOwner ? `My` : `${profileOwner}'s`}} Profile
      </h1>
      <div v-if="user&&!sameUser">
        <img alt="Follow icon" class="icon" v-if="followEnabled" @click="follow" src="../assets/follow-empty.svg"/>
        <img alt="Unfollow icon" class="icon" v-else @click="unfollow" src="../assets/follow-filled.svg"/>
      </div>
    </div>
    <div id="profileContent">
      <img alt="Fritter logo" src="../assets/logo.png" class="hooty">
      <UserInfo
        v-if="sameUser"
        @name-change="nameChange($event)"
      />
    </div>
    <DeleteUser v-if="sameUser"/>
    <table class="menuContainer"><tr class="menu">
      <td
        :class="{selected: display==='freets'}"
        @click="display='freets'"
        >History</td>
      <td
        :class="{selected: display==='following'}"
        @click="display='following'"
        >Following</td>
      <td
        :class="{selected: display==='followers'}"
        @click="display='followers'"
        >Followers</td>
    </tr></table>
    <div id="freetHistory" v-if="display==='freets'">
      <h1>
        {{user.username===profileOwner ? `My` : `${profileOwner}'s`}} Freets
      </h1>
    <div class="freet-scroll-container">
      <Freet 
        v-for="freet of freets" 
        :key="freet.freetID" 
        :freet="freet" 
        :user="user">
      </Freet>
    </div>
    </div>
    <div id="listFollowing" v-if="display==='following'">
      <h1>
        {{user.username===profileOwner ? `My` : `${profileOwner}'s`}} Following
      </h1>
      <UserList 
        v-bind:users='following'
      /> 
    </div>
    <div id="listFollowers" v-if="display==='followers'">
      <h1>
        {{user.username===profileOwner ? `My` : `${profileOwner}'s`}} Followers
      </h1>
      <UserList 
        v-bind:users='followers'
      /> 
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import UserInfo from '../components/UserInfo.vue';
import DeleteUser from '../components/DeleteUser.vue';
import UserList from '../components/UserList.vue';
import Freet from '../components/Freet.vue';

export default {
  name: 'Profile',
  props: ['user'],
  components: {
      UserInfo,
      DeleteUser,
      UserList,
      Freet,
  },
  data: function () {
    return {
      sameUser: undefined,
      followEnabled: undefined,
      display: "freets",
      freets: null,
      profileOwner: undefined,  // profile owner's username
      following: null,
      followers: null,
    }
  },
  mounted: function () {
    this.profileOwner = this.$route.params.username || this.user.username;
    this.sameUser = this.user && this.profileOwner === this.user.username;

    if (this.sameUser && this.$route.params.username) {
      this.$router.replace('/profile');
    }
    
    axios
      .get(`/api/users/${this.profileOwner}/followers`)
      .then(response => {
        this.followers = response.data;
        this.followEnabled = this.user && !this.followers.includes(this.user.username);
      });

    axios
      .get(`/api/users/${this.profileOwner}/following`)
      .then(response => {
        this.following = response.data;
      });

    this.getUserFreets().then((freets) => {
      if (freets !== null) return;
      if (this.$route.params.username) {  // must be invalid username
        this.$router.push('/404');
      } else {  // own profile; requires login
        eventBus.$emit('require-login-or', '/');
      }
    });

    /**
     * User just succesfully logged out of their account. Display Log In button in nav bar instead
     * of Signout.
     */
    eventBus.$on('freet-action-finished', () => {
      this.getUserFreets();
    });
  },
  methods: {
    /**
     * Follows another user
     */
    follow() {
      axios
        .post('/api/followers?followee=' + this.profileOwner)
        .then(() => {
          this.followEnabled = false;
          this.followers.push(this.user.username);
        });
    },
    /**
     * Unfollows another user
     */
    unfollow() {
      axios
        .delete('/api/followers?followee=' + this.profileOwner)
        .then(() => {
          this.followEnabled = true;
          const index = this.followers.indexOf(this.user.username)
          this.followers.splice(index, 1);
        });
    },
    /**
     * Gets all freets by the profile owner
     */
    async getUserFreets () {
      const freets = await axios
        .get(`/api/freets/?author=${this.profileOwner}`)
        .then(response => {
          return response.data;
        })
        .catch(() => null);
      this.freets = freets;
      return freets;
    },
    /**
     * Handle a username change
     */
    nameChange(newName) {
      this.profileOwner = newName;
      this.getUserFreets();
    }
  },
}
</script>

<style scoped>
  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .icon {
    width: 30px;
    height: 30px;
    margin: 0px 10px;
  }

  .icon:hover {
    cursor: pointer;
  }

  .menu {
    display: flex;
    max-width: 420px;
    width: 100%;
    border: 1px solid black;
    border-collapse: collapse;
  }

  .menuContainer {
    margin: 40px 0 0 0;
    max-width: 420px;
    width: 100%;
  }

  td {
    flex-basis: 140px;
    flex-grow: 1;
    border: 1px solid black;
  }

  .selected {
    background-color: #18b56edb;
  }

  #profileContent {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px;
  }

  #freetHistory {
    margin: 20px 0;
    width: 100%;
  }

  .profileLabel {
    display: flex;
    align-items: center;
  }
</style>
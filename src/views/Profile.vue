<template>
  <div class="profile">
    <FreetViewer 
    :user="user" 
    :freets="freets" 
    :followEnabled="false"
    :noFreetsMessage="'User has no Freets!'">
      <template v-slot:header>
        <div class="userInformation">
          <div class="profileLetter">
            {{user.username[0]}}
          </div>
          <div class="information">
            <h1>@{{user.username}}</h1>
            <h2>Follower Count: {{followingCount}}</h2>
          </div>
        </div>
      </template>
    </FreetViewer>
    <!--  
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
    
    -->
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import FreetViewer from '../components/FreetViewer.vue';

export default {
  name: 'Profile',
  props: ['user'],
  components: {
    FreetViewer
  },
  data: function () {
    return {
      sameUser: undefined,
      freets: undefined,
      profileOwner: undefined,  // profile owner's username
      followingCount: undefined,
      followEnabled: undefined
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
        let followers = response.data;
        this.followingCount = followers.length;
        this.followEnabled = this.user && !this.followers.includes(this.user.username);
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
    eventBus.$on('refresh-freets', () => {
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
  },
}
</script>

<style scoped>
  .userInformation {
    display: flex;
    align-items: center;
    color: white;
    width: 100%;
    padding: 10px;
    min-height: 200px;
    background-color: var(--purple);
    padding: 15px;
  }

  .information {
    margin: 20px;
    text-align: left;
  }

  .profileLetter {
    font-size: 100px;
    border-radius: 50%;
    background-color: var(--red);
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 5px 10px 5px;
  }
  h1 {
    margin: 0;
  }

  .icon {
    width: 30px;
    height: 30px;
    margin: 0px 10px;
  }

  .icon:hover {
    cursor: pointer;
  }
</style>
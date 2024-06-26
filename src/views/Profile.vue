<template>
  <div class="profile">
    <AllFreets 
    v-if="userExists"
    :user="user" 
    :freets="freets" 
    :refreetChain="refreetChain">
      <template v-slot>
        <div class="userInformation">
          <div class="profileLetter">
            {{profileOwner[0].toUpperCase()}}
          </div>
          <div class="information">
            <h1>@{{profileOwner}}</h1>
            <h2>Follower Count: {{followingCount}}</h2>
          </div>
        </div>
      </template>
    </AllFreets>
    <div class="noUser" v-else>
      User does not exist!
      <router-link to="/"> Click here to go to the homepage </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import AllFreets from '../components/AllFreets.vue';

export default {
  name: 'Profile',
  props: ['user'],
  components: {
    AllFreets
  },
  data: function () {
    return {
      userExists: undefined,
      refreetChain: undefined,
      sameUser: undefined,
      freets: undefined,
      profileOwner: undefined,  // profile owner's username
      followingCount: undefined,
      followEnabled: undefined,

      eventListeners: [
        {name: 'show-refreet-chain', func: this.getRefreetChain},
        {name: 'refresh-freets', func: this.getUserFreets}
      ]
    }
  },
  mounted: function () {
    this.profileOwner = this.$route.params.username || this.user.username;
    this.sameUser = this.user && this.profileOwner === this.user.username;

    if (this.sameUser && this.$route.params.username) {
      this.$router.replace('/profile');
    }
    
    eventBus.$on("refresh-user", () => {
      if (!this.$route.params.username ) {
        axios.get('/api/session').then((user) => {
          this.profileOwner = user.data.username;
        }).catch(() => {});
      }
    });

    axios
      .get("/api/users")
      .then((response) => {
        this.userExists = response.data.includes(this.profileOwner);
      })
      .catch((error) => {
        console.log(error);
      })

    axios
      .get(`/api/users/${this.profileOwner}/followers`)
      .then(response => {
        let followers = response.data;
        this.followingCount = followers.length;
        if (this.followers)
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

    this.eventListeners.forEach((e) => eventBus.$on(e.name, e.func));
  },
  beforeDestroy: function() {
    this.eventListeners.forEach((e) => eventBus.$off(e.name, e.func));
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
     * Gets sidepanel refreet chain
     */
    getRefreetChain(id) {
      axios.get(`/api/freets/${encodeURIComponent(id)}/children`)
        .then((result) => {
          this.refreetChain = result.data;
        }).catch((error) => {
          console.log(error);
        })
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
    min-height: 150px;
    background-color: var(--purple);
    padding: 15px;
  }

  .information {
    margin: 20px;
    text-align: left;
  }

  .profileLetter {
    font-size: 60px;
    border-radius: 50%;
    background-color: var(--red);
    width: 110px;
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
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

  .noUser {
    margin: 10px;
    font-size: 24px;
  }
</style>
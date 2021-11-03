<template>
  <div class="two-panel-container">
    <div>
      <form id="newFreet" v-if="user">
        <span>Welcome {{user.username}}! You are signed in. </span>
        <div>
            <input type="text" id="username" placeholder="Compose your new freet here!" name="composeFreet" v-model="newFreet">
        </div>
        <input
          type="submit"
          value="Post"
          :disabled="!newFreet"
          v-on:click.prevent="createNewFreet"
        />
        <div v-if="invalidFreet">
            {{this.freetFailMessage}}
        </div>
      </form>
      <span v-else>You're welcome to browse Freets without an account, but please log in or create an account to post Freets of your own!</span>

      <hr/>

      <div v-if="viewingId || searchingAuthor">
        <div v-if="viewingId">
          <span v-if="allFreets.length > 0">You are viewing Freet with ID {{viewingId}}</span>
          <span v-else>No Freets with ID {{viewingId}} exist.</span>
        </div>
        <div v-else>
          <span>You are searching for Freets by {{searchingAuthor}}</span>
        </div>
        <br/>
        <div>
          <a href="#" @click="showAllFreets">Show all freets instead</a>
          <span v-if="user">
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <a href="#" @click="showFollowing">Show following instead</a>
          </span>
        </div>
        <hr/>
      </div>
      <div v-else>
        <div v-if="user && !viewFollowing">You are viewing all freets. <button @click="showFollowing" >View Following Only</button></div>
        <div v-if="viewFollowing">
          <span v-if="user">You are viewing freets from accounts you are following. </span>
          <span v-else>You must log in to view freets from accounts you are following! </span>
          <button @click="showAllFreets">View All</button>
        </div>
      </div>
      <hr/>

      <div class="sort-container">
        <div class="sort-item" v-on:click="setSortNewest">
          <img class="sort-icon" src="../assets/logo.png" />
          <p class="sort-text">Newest</p>
        </div>
        <div class="sort-item" v-on:click="setSortPopular">
          <img class="sort-icon" src="../assets/logo.png" />
          <p class="sort-text">Popular</p>
        </div>
      </div>

      <div class="freet-scroll-container">
          <Freet v-for="freet of allFreets" v-bind:key="freet.freetID" :freet="freet" :user="user" :complex="true"></Freet>
      </div>

    </div>
    <div v-if="refreetChain">
      <RefreetChain 
        :freet="refreetChain"
        :user="user"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Freet from "./Freet";
import RefreetChain from "./RefreetChain";
import {eventBus} from "../main";

export default {
  name: "AllFreets",
  components: { Freet, RefreetChain },
  props: ["user"],
  data() {
    return {
        newFreet: "",
        allFreets: [],
        invalidFreet: false,
        freetFailMessage: "",
        searchingAuthor: "",
        viewingId: "",
        viewFollowing: false,
        sort: "newest",
        refreetChain: undefined,
    };
  },
  created: function() {
    eventBus.$on('change-sort', () => {
      this.toggleSort();
    })
    eventBus.$on('refresh-freets', () => {
      this.refreshFreets();
    })
    eventBus.$on('show-single-freet', (data) => {
      this.$router.push({ name: 'Explore', query: { id: data.id } }).catch(()=>{});
      this.getSingleFreet(data.id);
    })
    eventBus.$on('show-all-freets', () => {
      this.$router.push({ name: 'Explore' }).catch(()=>{});
      this.getFreets();
    })
    eventBus.$on('show-following', (data) => {
      this.$router.push({ name: 'Explore', query: { following: data.following } }).catch(()=>{});
      this.getFollowing();
    })
    eventBus.$on('search', (data) => {
      this.$router.push({ name: 'Explore', query: { author: data.author } }).catch(()=>{});
      this.search(data.author)
    })
    eventBus.$on('show-refreet-chain', (data) => {
      this.getRefreetChain(data.id);
    })
  },
  mounted: function() {
    this.refreshFreets();
  },
  methods: {
    getRefreetChain: function(id) {
      axios.get(`/api/freets/${encodeURIComponent(id)}/children`)
      .then((result) => {
        console.log(result.data);
        this.refreetChain = result.data;
      }).catch((error) => {
        console.log(error);
      })
    },

    showFollowing: function() {
      eventBus.$emit('show-following', {following: 'true'});
    },
    
    showAllFreets() {
      eventBus.$emit('show-all-freets');
    },
    
    search(author) {
      axios.get(`/api/freets/?author=${encodeURIComponent(author)}&sort=${this.sort}`)
        .then((result) => {
          this.allFreets = result.data;
          this.searchingAuthor = author;
          this.viewingId = "";
        }).catch((error) => {
          console.log(error);
        })
    },
    
    getFollowing() {
      axios.get("/api/freets/" + encodeURIComponent(this.user.userID) + "/following")
        .then((result) => {
          this.allFreets = result.data;
          this.viewFollowing = true;
          this.searchingAuthor = "";
          this.viewingId = "";
        }).catch((error) => {
          this.viewFollowing = true;
          this.allFreets = [];
          console.log(error);
        })
    },
    
    getSingleFreet(id) {
      axios.get(`/api/freets/${id}`)
        .then((result) => {
          this.allFreets = result.data;
          this.searchingAuthor = "";
          this.viewFollowing = false;
          this.viewingId = id;
        }).catch((error) => {
          this.viewingId = id;
          this.allFreets = [];
          console.log(error);
        })
    },
    
    getFreets() {
      axios.get(`/api/freets?sort=${this.sort}`)
        .then((result) => {
          this.allFreets = result.data;
          this.searchingAuthor = "";
          this.viewFollowing = false;
          this.viewingId = "";
        }).catch((error) => {
          console.log(error);
        })
    },
    
    refreshFreets() {
      let q = undefined;
      if (this.$route) {
        q = this.$route.query;
      }

      if (q.sort) {
        if (q.sort == 'popular') {
          this.sort = 'popular';
        } else {
          this.sort = 'newest';
        }
      }

      if (q.id) {
        this.getSingleFreet(q.id);
      } else if (q.author) {
        this.search(q.author);
      } else if (q.following === 'true') {
        this.getFollowing();
      } else {
        this.getFreets();
      }
    },
    
    createNewFreet() {
      axios.post("/api/freets", {content: this.newFreet})
      .then(() => {
        this.invalidFreet = false;
        this.freetFailMessage = "";
        this.newFreet = "";
        eventBus.$emit('refresh-freets');
      })
      .catch((error) => {
        this.invalidFreet = true;
        this.freetFailMessage = error.response.data.error;
      })
    },

    changeSort() {
      eventBus.$emit('change-sort');
    },

    setSortNewest() {
      this.sort = "newest";
      let query = Object.assign({}, this.$route.query);
      query.sort = 'newest';
      this.$router.push({ name: 'Explore', query: query }).catch(()=>{});
    },

    setSortPopular() {
      this.sort = "popular";
      let query = Object.assign({}, this.$route.query);
      query.sort = 'popular';
      this.$router.push({ name: 'Explore', query: query }).catch(()=>{});
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../variables.scss';

.two-panel-container {
  display: flex;
  flex-direction: row;
}

.freet-scroll-container {
    height: 70vh;
    /* padding: var(--m) var(--m); */
    /* margin: auto; */
    overflow-y: auto;
}

.sort-container {
  display: flex;
  justify-content: space-around;
}

.sort-item {
  cursor: pointer;
}

.sort-icon {
  width: 150px;
  height: 150px;
}

.sort-text {
  margin: 0px;
  padding: 0px;
  font-size: 40px;
  font-weight: bolder;
  color: $red;
}

</style>
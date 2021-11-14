<template>
  <div class="nonexistent">
    <div class="text">
      <h1> Oops. This page doesn't exist. </h1>
      <router-link to="/">Click back here to go home.</router-link>
    </div>
    <div class="text">
      <h2>Are you looking for one of these pages?</h2>
      <span class="left">
        <router-link :to="{ name: 'Home' }">Home</router-link> - Home page
        <br>
        <router-link :to="{ name: 'Explore' }">Explore</router-link> - View all Freets or by an author.
        <br>
        <router-link :to="{ name: 'Profile' }">My Profile</router-link> - View your Freet history (must be logged in)
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nonexistent',
}
</script>

<style scoped>
  .nonexistent {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .text {
    max-width: 600px;
    margin: 10px;
  }
  .left {
    display: block;
    text-align: left;
  }
</style>
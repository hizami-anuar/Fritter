<template>
  <div class="nonexistent">
    <div class="text">
      <h1> Oops. This page doesn't exist. </h1>
      <router-link to="/">Click back here to go home.</router-link>
    </div>
    <div class="text">
      <h1>Fritter's available pages</h1>
      <span class="left">
        GET / -- Go to home page
        <br>
        GET /explore -- Go to explore page to view all Freets or by an author.
        <br>
        GET /profile -- Go to your own profile page to update user info or delete account.
        <br>
        GET /profile/:username -- View another user's profile and their Freet history
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
<template>
  <div class="userList" v-if="users.length">
    <article class="userListContent" v-for="user of users" :key="user">
      <img alt="Fritter logo" src="../assets/logo.png" class="icon">
      <router-link :to="`/profile/${user}`">{{user}}</router-link>
    </article>
  </div>
  <p v-else>
    No users yet!
  </p>
</template>

<script>
export default {
  name: 'UserList',
  props: ["users"],
}
</script>

<style scoped>
  .userList {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .userListContent {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    max-width: 600px;
    width: 100%;
  }

  .icon {
    width: 40px;
    height: 40px;
    margin: 5px;
  }
</style>
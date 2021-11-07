<template>
  <div class="App-container">
    <div class="Main-container">
      <AllFreets :user="user"></AllFreets>
    </div>
  </div>
</template>

<script>
import AllFreets from '../components/AllFreets.vue';


export default {
  name: "home",
  props: ["user"],
  data() {
    return {
      loggedIn: false,
      showLogin: false,
      showCreateAccount: false,
    };
  },
  components: { AllFreets },
}
</script>

<style>
.App-container {
    max-width: 100%;
    width: 100vw;
    height: 98vh;
}

.Main-container {
    width: auto;
    max-width: 50vw;
    margin: auto;
    height: 100%;
    left: 0px;
    top: 0px;

    padding: 0px 24px;

    background: white;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}
</style>

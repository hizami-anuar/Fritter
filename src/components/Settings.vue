<template>
  <div>
    <div class="settings" v-if="showSettings">
      <section>
        <UserInfo :user="user" />
        <DeleteUser :user="user" />
        <button v-on:click="deactivate">Close</button>
      </section>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import UserInfo from "./UserInfo";
import DeleteUser from "./DeleteUser";

export default {
  name: 'Settings',
  props: ["user"],
  components: { UserInfo, DeleteUser },
  data() {
    return {
      showSettings: false,
    };
  },
  mounted() {
    eventBus.$on("show-settings", () => {
      this.activate();
    });
    eventBus.$on("hide-settings", () => {
      this.deactivate();
    });
  },
  methods: {
    activate() {
      this.showSettings = true;
    },
    deactivate() {
      this.showSettings = false;
    },
  }
}
</script>

<style scoped>
  .settings {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(100, 100, 100, 0.5);
  }

  section {
    border: 1px solid;  
    background: white;
    outline: solid white;
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 500px;
    position: absolute;
    left: calc(50% - 200px);
    top: calc(50% - 250px);
    align-items: center;
    padding: 25px;
  }
</style>
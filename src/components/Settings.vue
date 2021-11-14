<template>
  <div>
    <div class="settings" v-if="showSettings">
      <section>
        <img src="../assets/close.svg" class="closeButton" @click='deactivate'/>
        <UserInfo :user="user" />
        <DeleteUser :user="user" />
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

  .settings:hover {
    cursor: pointer;
  }

  section {
    color: white;
    background: var(--purple);
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

  .closeButton {
    align-self: flex-end;
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(98deg) brightness(106%) contrast(101%);
  }
</style>
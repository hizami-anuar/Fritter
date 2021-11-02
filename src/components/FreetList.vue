<template>
  <div class="freetList" v-if="freets.length">
    <article class="freetListContent" v-for="(freet, index) of freets" :key="freet">
      <PostCard 
        v-if='freet'
        :freet='freet'
        :user='user'
        :complex='true'
        :index=index
      />
    </article>
  </div>
  <p v-else>
    No freets available!
  </p>
</template>

<script>
import PostCard from './PostCard.vue';

export default {
  name: 'FreetList',
  props: ["freets", "user"],
  components: {
    PostCard,
  },
}
</script>

<style scoped>
  .freetList {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .freetListContent {
    min-width: 200px;
    max-width: 600px;
    width: 100%;
  }
</style>
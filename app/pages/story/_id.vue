<template>
  <div class="container">
    <div>
      <story />
    </div>
  </div>
</template>

<script>
import Story from '~/components/Story.vue';
export default {
  middleware: 'auth',
  components: {
    Story,
  },
  mounted() {
    console.log('mounted');
    this.$store.dispatch('story/startStory', this.$route.params.id);
  },
};
</script>

<style scoped>
/* Sample `apply` at-rules with Tailwind CSS
*/
.container {
  margin: 0 auto;
  min-height: calc(100vh - 48px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

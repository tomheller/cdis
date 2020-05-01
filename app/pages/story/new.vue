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
  async mounted() {
    await this.$store.dispatch('user/updateOrCreate', this.$auth.user);
    await this.$store.dispatch('chapter/enterEditMode');
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

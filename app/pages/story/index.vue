<template>
  <div class="container">
    <div v-for="story in availableStories" :key="story._id" class="story">
      <h2 class="story-title">{{ story.title }}</h2>
      <div class="story-content" v-html="story.content"></div>
      <nuxt-link
        :to="{
          name: 'story-id',
          params: { id: story.id },
        }"
        class="story-choose"
        >Choose this story</nuxt-link
      >
    </div>
    <div class="story story-new">
      <h2 class="story-title">Create</h2>
      <p>You can also start a new story for everyone to enjoy and extend.</p>
      <nuxt-link
        :to="{
          name: 'story-new',
        }"
        class="story-choose"
        >Create a new story</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      availableStories: (state) => state.story.availableStories,
    }),
  },
  mounted() {
    this.$store.dispatch('story/loadAvailableStories');
  },
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: calc(100vh - 48px);
  display: grid;
  justify-content: center;
  align-items: center;
  text-align: center;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  @apply p-4;
}

.story {
  @apply bg-white rounded p-4;
}

.story-new .story-choose {
  @apply bg-blue-500;
}
.story-new .story-choose:hover {
  @apply bg-blue-600;
}

.story-title {
  @apply text-xl font-bold mb-2;
}

.story-content {
  @apply text-left relative;
  max-height: 10rem;
  overflow: hidden;
}
.story-content:after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2rem;
  background: linear-gradient(rgba(255, 255, 255, 0), #fff);
}

.story-choose {
  @apply mt-4 font-bold text-white px-4 py-2 bg-green-500 inline-block shadow transition-colors rounded duration-200;
}
.story-choose:hover {
  @apply bg-green-700;
}
</style>

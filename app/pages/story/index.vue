<template>
  <div class="container">
    <h2 class="story-chooser-title">Choose one of these stories</h2>
    <transition name="fade" mode="out-in">
      <div
        v-if="availableStories.length > 0"
        class="grid-container"
        key="availableStories"
      >
        <div v-for="story in availableStories" :key="story._id" class="story">
          <h3 class="story-title">{{ story.title }}</h3>
          <div class="story-content" v-html="story.content"></div>
          <nuxt-link
            :to="{
              name: 'story-id',
              params: { id: story._id },
            }"
            class="story-choose"
            >Choose this story</nuxt-link
          >
        </div>
      </div>
      <div v-else key="skeleton" class="grid-container">
        <div class="story ghost-story"></div>
        <div class="story ghost-story"></div>
        <div class="story ghost-story"></div>
      </div>
    </transition>
    <h2 class="story-chooser-title">Or create a new one</h2>

    <div class="grid-container">
      <div class="story story-new">
        <h3 class="story-title">Create</h3>
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
  justify-content: center;
  align-items: center;
  text-align: center;
  @apply p-4;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  @apply my-4;
}

.story {
  @apply bg-white rounded p-4;
  min-height: 8rem;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.6;
  }
}

.story.ghost-story {
  @apply bg-gray-300 border-gray-400 border;
  animation: 1.2s infinite pulse;
}
.story.ghost-story:nth-child(2) {
  animation-delay: 0.4s;
}
.story.ghost-story:nth-child(3) {
  animation-delay: 0.6s;
}

.story-chooser-title {
  @apply text-2xl font-bold mb-2;
}

.story-new {
  grid-column: 2;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="story-wrapper">
    <transition-group @enter="enterHook">
      <chapter
        v-for="chapter in story"
        :key="chapter._id"
        class="chapter-in-story"
        :chapter-data="chapter"
      />
    </transition-group>
    <chapter-edit v-if="editmode" />
  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import { mapState } from 'vuex';
import Chapter from './chapter/Chapter';
import ChapterEdit from './editmode/ChapterEdit';

export default {
  components: {
    Chapter,
    ChapterEdit,
  },
  computed: {
    ...mapState({
      editmode: (state) => state.chapter.editMode,
      story: (state) => state.chapter.story,
    }),
  },
  methods: {
    enterHook(el, done) {
      console.log(el);
      Velocity(
        el,
        { opacity: 0 },
        {
          duration: 0,
          complete: () => {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          },
        },
      );
      Velocity(
        el,
        { opacity: 1 },
        {
          duration: 1000,
          easing: 'easeOutInQuart',
          complete: done,
        },
      );
    },
  },
};
</script>

<style scoped>
.chapter-in-story {
  @apply my-4;
}
.chapter-in-story:last-child {
  margin-bottom: 25vh;
}
</style>

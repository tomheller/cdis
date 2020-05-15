<template>
  <div class="story-wrapper">
    <transition-group @enter="enterHook">
      <div
        class="chapter-in-story"
        v-for="(chapter, index) in story"
        :key="chapter._id"
      >
        <svg v-if="index > 0" class="connector" viewBox="0 0 60 170">
          <line class="connector-line" x1="30" y1="30" x2="30" y2="150" />
          <circle class="connector-upper" cx="30" cy="30" r="15" />
          <circle class="connector-lower" cx="30" cy="146" r="15" />
        </svg>
        <chapter class="chapter" :chapter-data="chapter" />
      </div>
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
      const upperConnector = el.querySelector('.connector-upper');
      const line = el.querySelector('.connector-line');
      const lowerConnector = el.querySelector('.connector-lower');
      const chapter = el.querySelector('.chapter');

      Velocity(upperConnector, { r: 0 }, { duration: 0 });
      Velocity(
        upperConnector,
        { r: 18 },
        { duration: 250, easing: [0.09, 0.53, 0.62, 1.34] },
      );

      Velocity(line, { y2: 20 }, { duration: 0, easing: 'easeOutInQuart' });
      Velocity(
        line,
        { y2: 150 },
        { delay: 125, duration: 250, easing: 'easeOutInQuart' },
      );

      Velocity(lowerConnector, { r: 0 }, { duration: 0 });
      Velocity(
        lowerConnector,
        { r: 18 },
        { delay: 300, duration: 250, easing: [0.09, 0.53, 0.62, 1.34] },
      );

      // First, hide the chapter and scroll it into view.
      Velocity(
        chapter,
        { opacity: 0 },
        {
          duration: 0,
          complete: () => {
            chapter.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          },
        },
      );
      // Fade the chapter in slowly.
      Velocity(
        chapter,
        { opacity: 1 },
        {
          delay: 500,
          duration: 350,
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
  position: relative;
  margin-top: 1rem;
  margin-bottom: 30px;
}
.chapter-in-story:last-child {
  margin-bottom: 25vh;
}

.connector {
  position: absolute;
  left: 50%;
  top: -38px;
  width: 15px;
  z-index: 1;
  transform: translateX(-50%);
}

.connector-upper,
.connector-lower {
  fill: #fff;
  /* tailwinds gray 500 */
  stroke: #a0aec0;
  stroke-width: 10;
}

.connector-line {
  /* tailwinds gray 500 */
  stroke: #a0aec0;
  stroke-width: 10;
}
</style>

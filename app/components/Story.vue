<template>
  <div>
    <chapter
      v-for="chapter in story"
      :key="chapter._id"
      class="chapter-in-story"
      :chapter-data="chapter"
    />
    <chapter-edit v-if="editmode" />
  </div>
</template>

<script>
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
  mounted() {
    this.$store.dispatch('chapter/loadEntrypoints');
  },
};
</script>

<style scoped>
.chapter-in-story {
  @apply my-4;
}
</style>

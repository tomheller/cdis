<template>
  <div>
    <chapter
      class="chapter-in-story"
      v-for="chapter in story"
      :key="chapter._id"
      :chapterData="chapter"
    />
    <chapter-edit v-if="editmode" />
  </div>
</template>

<script>
import Chapter from './chapter/Chapter';
import ChapterEdit from './editmode/ChapterEdit';
import { mapState } from 'vuex'

export default {

  components: {
    Chapter,
    ChapterEdit
  },
  computed: {
    ...mapState({
      editmode: state => state.chapter.editMode,
      story: state => state.chapter.story,
    }),
  },
  mounted() {
    this.$store.dispatch('chapter/loadEntrypoints');
  },
}
</script>


<style scoped>
.chapter-in-story {
  @apply my-4;
}
</style>

<template>
  <div class="chapter">
    <h1 class="chapter-headline">{{ chapterData.title }}</h1>

    <article class="chapter-content" v-html="chapterData.body"></article>

    <div class="chapter-choicecontainer">
      <div v-if="chosenContinuationRef === undefined" key="choicelist">
        <choice
          v-for="choice in chapterData.choices"
          :key="choice._id"
          @selected="choose(choice, $event)"
        >
          {{ choice.title }}
        </choice>
        <choice
          v-if="$auth.loggedIn"
          :is-secondary-choice="true"
          @selected="addNewPath"
        >
          Add a new path
        </choice>
      </div>
      <transition
        name="fade"
        mode="in-out"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <div v-if="chosenContinuationRef !== undefined">
          <choice
            ref="chosenContinuation"
            class="selected-choice"
            :is-selected="true"
          >
            {{ chosenContinuationTitle }}
          </choice>
        </div>
      </transition>
    </div>
    <div v-if="chapterData.author" class="author">
      <img :src="chapterData.author.image" :alt="chapterData.author.name" />
    </div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import Choice from '~/components/chapter/Choice';

export default {
  components: {
    Choice,
  },
  props: {
    chapterData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chosenPositionRect: undefined,
      localChosenRef: undefined,
    };
  },
  computed: {
    chosenContinuationRef() {
      return this.localChosenRef || this.chapterData.chosen;
    },
    chosenContinuationTitle() {
      const chosenContinuation = (this.chapterData.choices || []).find(
        (cont) => cont.continuation._ref === this.chosenContinuationRef,
      );
      return chosenContinuation ? chosenContinuation.title : '';
    },
  },
  methods: {
    choose(choice, { target }) {
      this.chosenPositionRect = target.getBoundingClientRect();
      this.localChosenRef = choice.continuation._ref;
    },

    // the done callback is optional when
    // used in combination with CSS
    enter(_el, done) {
      const targetRect = this.$refs.chosenContinuation.$el.getBoundingClientRect();
      const offsetX = this.chosenPositionRect.x - targetRect.x;
      const offsetY = this.chosenPositionRect.y - targetRect.y;
      Velocity(
        this.$refs.chosenContinuation.$el,
        {
          translateX: offsetX,
          translateY: offsetY,
        },
        { duration: 0 },
      );
      Velocity(
        this.$refs.chosenContinuation.$el,
        {
          translateX: 0,
          translateY: 0,
        },
        {
          duration: 300,
          easing: 'easeOutInQuart',
          complete: done,
        },
      );
    },
    afterEnter() {
      this.$store.dispatch('chapter/chooseContinuation', this.localChosenRef);
      this.localChosenRef = undefined;
    },
    addNewPath() {
      this.$store.dispatch('user/updateOrCreate', this.$auth.user).then(() => {
        this.$store.dispatch('chapter/addNewPath', this.chapterData);
      });
    },
  },
};
</script>

<style>
.chapter {
  @apply bg-white rounded min-w-full max-w-xl p-4 relative;
}

.chapter-headline {
  @apply text-3xl;
}
.chapter-content {
  @apply my-4 text-left;
}

.chapter-choicecontainer {
  position: relative;
}

.author {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}
.author img {
  @apply w-8 h-8 rounded-full border border-gray-400 shadow-sm;
}
</style>

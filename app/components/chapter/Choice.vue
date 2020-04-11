<template>
  <button
    @click="selected"
    :class="{
      choice: true,
      'selected-choice': isSelected,
      'secondary-choice': isSecondaryChoice
    }"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    isSelected: {
      type: Boolean,
      default: false
    },
    isSecondaryChoice: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selected() {
      this.$emit('selected', { target: this.$el });
    }
  }
};
</script>

<style>
.choice {
  @apply bg-blue-500 text-white font-bold py-2 px-4 mx-2 my-2 rounded;
  @apply transition-colors duration-200 ease-linear;
}

.choice.secondary-choice {
  @apply bg-green-500 text-white;
}
.choice.secondary-choice:hover,
.choice.secondary-choice:active {
  @apply bg-green-600;
}


.choice.selected-choice,
.choice.selected-choice:hover,
.choice.selected-choice:active {
  @apply bg-transparent text-blue-500;
}

.choice:hover {
  @apply bg-blue-700;
}
</style>

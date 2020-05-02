<template>
  <div class="editmode-card">
    <p class="editmode-info" v-if="!isNewStory">
      Currently adding a path choice to
      <em>&ldquo;{{ parentChapter.title }}&rdquo;</em>
    </p>
    <p v-else>
      You are creating the first chapter in this story.
    </p>
    <div
      class="chapter-edit-formwrapper"
      :class="{ 'chapter-is-saving': saving }"
    >
      <div class="formwrapper" :hidden="isNewStory">
        <label>Choice title</label>
        <input
          ref="choiceTitleFormfield"
          v-model="choiceTitle"
          type="text"
          required
          placeholder="Choice title that will be displayed"
        />
      </div>
      <div class="formwrapper">
        <label>Chapter title</label>
        <input
          ref="titleFormfield"
          v-model="newTitle"
          type="text"
          required
          placeholder="Add a title for your new chapter"
        />
      </div>
      <div class="formwrapper">
        <label>Chapter content</label>
        <div class="editorwrapper">
          <editor-menu-bubble
            v-slot="{ commands, isActive, menu }"
            :editor="editor"
            :keep-in-bounds="true"
          >
            <div
              class="menububble"
              :class="{ 'is-active': menu.isActive }"
              :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
            >
              <button
                :class="{ 'is-active': isActive.bold() }"
                style="font-weight: bold;"
                title="Bold"
                @click="commands.bold"
              >
                B
              </button>
              <button
                :class="{ 'is-active': isActive.italic() }"
                style="font-style: italic; font-family: serif;"
                title="Italic"
                @click="commands.italic"
              >
                I
              </button>
            </div>
          </editor-menu-bubble>
          <editor-content :editor="editor" class="editor" />
        </div>
      </div>
    </div>
    <div class="formwrapper formwrapper-submit">
      <button class="editmode-action editmode-cancel" @click="cancelEditMode">
        Cancel
      </button>
      <button class="editmode-action editmode-submit" @click="saveChapter">
        Save chapter <spinner v-if="saving" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap';
import { Bold, Italic, History } from 'tiptap-extensions';
import Spinner from '~/components/utils/Spinner';

export default {
  components: {
    EditorContent,
    EditorMenuBubble,
    Spinner,
  },
  data() {
    return {
      editor: new Editor({
        content: 'Hello',
        extensions: [new Bold(), new Italic(), new History()],
      }),
      newTitle: 'Hello bello',
      choiceTitle: '',
      saving: false,
    };
  },
  computed: {
    ...mapState({
      parentChapter: (state) => state.chapter.currentlyAddingToChapter,
      isNewStory: (state) =>
        state.chapter.currentlyAddingToChapter._id === undefined,
    }),
  },
  mounted() {
    this.$refs.choiceTitleFormfield.focus();
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    cancelEditMode() {
      this.$store.dispatch('chapter/cancelEditMode');
    },
    async saveChapter() {
      if (this.saving === true) {
        return;
      }
      this.saving = true;
      if (this.isNewStory) {
        const newStory = await this.$store.dispatch('chapter/createNewStory', {
          title: this.newTitle,
          content: this.editor.getHTML(),
        });
        this.$router.push({ name: 'story-id', params: { id: newStory._id } });
      } else {
        await this.$store.dispatch('chapter/saveChapter', {
          title: this.newTitle,
          choiceTitle: this.choiceTitle,
          content: this.editor.getHTML(),
          parentChapter: this.parentChapter,
        });
      }
      this.saving = false;
    },
  },
};
</script>

<style>
.editmode-card {
  @apply my-4 bg-white rounded px-4 py-4 min-w-full max-w-xl;
}

.editmode-info {
  @apply pb-4 text-gray-800;
}

.formwrapper {
  @apply text-left mb-4;
}
.formwrapper > label,
.formwrapper > input {
  @apply block;
}

.formwrapper > input {
  @apply border border-blue-500 rounded px-4 py-2 mt-2 block w-full;
}

.formwrapper > input:placeholder {
  @apply text-gray-600;
}

.formwrapper > label {
  @apply text-sm italic text-gray-800;
}

.chapter-is-saving {
  @apply opacity-75;
}

.editor {
  @apply relative h-64;
}

.editorwrapper {
  @apply block relative;
  @apply border border-blue-500 rounded px-4 py-2 mt-2 block w-full;
}

.menububble {
  @apply absolute z-10 -mt-2 invisible opacity-0 transition-opacity duration-200;
  @apply bg-blue-800 rounded -translate-x-1/2 py-1 px-1 text-white;
  @apply flex;
}

.menububble.is-active {
  @apply opacity-100 visible;
}

.menububble button {
  @apply text-sm border-white border rounded mx-1 w-8 h-8;
}
.menububble button:hover {
  @apply bg-blue-600;
}

.menububble button.is-active {
  @apply bg-blue-600;
}

.ProseMirror-focused {
  outline: 0;
}
.ProseMirror {
  @apply h-full;
}

.formwrapper-submit {
  @apply text-right;
}

.editmode-action {
  @apply bg-green-500 text-white font-bold py-2 px-4 ml-2 my-2 rounded;
  @apply transition-colors duration-200 ease-linear;
}
.editmode-action:hover {
  @apply bg-green-700;
}

.editmode-cancel {
  @apply bg-red-500;
}
.editmode-cancel:hover {
  @apply bg-red-700;
}
</style>

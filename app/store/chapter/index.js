const blocksToHtml = require('@sanity/block-content-to-html');

export const state = () => ({
  story: [],
  editMode: false,
  currentlyAddingToChapter: {},
});

export const mutations = {
  resetStory(state) {
    state.story = [];
    return state;
  },

  addChapterToStory(state, chapter) {
    delete chapter.body;
    const story = [...state.story, chapter];
    state.story = story;
    return state;
  },

  updateChapter(state, chapterToUpdate) {
    const selectedChapterIndex = state.story.findIndex(
      (ch) => ch._id === chapterToUpdate._id,
    );
    state.story[selectedChapterIndex] = chapterToUpdate;
    state.story = [...state.story];
    return state;
  },

  setChoiceForChapter(state, { chapter, reference }) {
    const selectedChapterIndex = state.story.findIndex(
      (ch) => ch._id === chapter._id,
    );
    state.story[selectedChapterIndex] = {
      ...state.story[selectedChapterIndex],
      chosen: reference,
    };
    state.story = [...state.story];
    return state;
  },

  setEditMode(state, editMode) {
    state.editMode = editMode;
    return state;
  },

  setEditmodeParent(state, chapterData) {
    state.currentlyAddingToChapter = chapterData;
    return state;
  },
};

export const actions = {
  async loadEntrypoints({ commit }) {
    const entryComponentsResponse = await this.$axios.get(
      '/api/story/get-starting-points/',
    );
    const entryComponents = entryComponentsResponse.data;
    const entry = entryComponents[0];
    entry.content = blocksToHtml({
      blocks: entry.body,
    });
    commit('resetStory');
    commit('addChapterToStory', entry);
  },

  addChapterToStory({ commit }, chapter) {
    commit('addChapterToStory', chapter);
  },

  async chooseContinuation({ commit, state }, reference) {
    commit('setChoiceForChapter', {
      chapter: state.story[state.story.length - 1],
      reference,
    });

    const nextChapterResponse = await this.$axios.get(
      `/api/story/get-by-id/${reference}`,
    );
    const nextChapter = nextChapterResponse.data;
    nextChapter.content = blocksToHtml({
      blocks: nextChapter.body,
    });

    commit('addChapterToStory', nextChapter);
  },

  enterEditMode({ commit }) {
    commit('setEditMode', true);
  },

  cancelEditMode({ commit }) {
    commit('setEditMode', false);
    commit('setEditmodeParent', {});
  },

  async addNewPath({ dispatch, commit }, chapterData) {
    await dispatch('enterEditMode');
    commit('setEditmodeParent', chapterData);
  },

  async saveChapter(
    { dispatch, rootState },
    { title, content, parentChapter },
  ) {
    const patchedChapter = await this.$axios.post('/api/story/save-chapter', {
      title,
      content,
      author: rootState.user.ref,
      parentChapterId: parentChapter._id,
    });

    await dispatch('cancelEditMode');
    console.log('patched', patchedChapter.data);
    await dispatch('updateChapter', patchedChapter.data._id);
  },

  async updateChapter({ commit }, chapterId) {
    console.log('update chapter', chapterId);
    const updatedChapterResponse = await this.$axios.get(
      `/api/story/get-by-id/${chapterId}`,
    );
    console.log('updated', updatedChapterResponse.data);
    const updatedChapter = updatedChapterResponse.data;
    updatedChapter.content = blocksToHtml({
      blocks: updatedChapter.body,
    });
    commit('updateChapter', updatedChapter);
  },
};

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
  addChapterToStory({ commit }, chapter) {
    commit('addChapterToStory', chapter);
  },

  resetStory({ commit }) {
    commit('resetStory');
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
    { commit, dispatch, rootState },
    { title, choiceTitle, content, parentChapter },
  ) {
    await dispatch('user/updateOrCreate', rootState.auth.user, { root: true });
    const patchedChapter = await this.$axios.post('/api/story/save-chapter', {
      title,
      choiceTitle,
      content,
      author: rootState.user.ref,
      parentChapterId: parentChapter._id,
    });

    await dispatch('cancelEditMode');
    commit('updateChapter', patchedChapter.data);
  },

  async createNewStory({ dispatch, rootState }, { title, content }) {
    const newStory = await this.$axios.post('/api/story/new-story', {
      title,
      content,
      author: rootState.user.ref,
    });
    await dispatch('cancelEditMode');
    return newStory.data;
  },
};

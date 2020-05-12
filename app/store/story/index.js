export const state = () => ({
  availableStories: [],
  chosenStory: {},
});

export const mutations = {
  setAvailableStories(state, availableStories) {
    state.availableStories = availableStories;
    return state;
  },
  resetChosenStory(state) {
    state.chosenStory = {};
    return state;
  },
};

export const actions = {
  async loadAvailableStories({ commit }) {
    const storiesResponse = await this.$axios.get(
      '/api/story/get-starting-points/',
    );
    const availableStories = [];
    for (const story of storiesResponse.data) {
      availableStories.push(story);
    }
    commit('setAvailableStories', availableStories);
  },

  async startStory({ dispatch }, reference) {
    const startStoryChapterResponse = await this.$axios.get(
      `/api/story/get-by-id/?id=${reference}`,
    );
    const startStoryChapter = startStoryChapterResponse.data;
    await dispatch('chapter/resetStory', null, { root: true });
    await dispatch('chapter/addChapterToStory', startStoryChapter, {
      root: true,
    });
  },

  resetStory({ commit }) {
    commit('resetChosenStory');
  },
};


export const state = () => ({
  user: '',
  image: '',
  token: '',
  ref: '',
});


export const mutations = {
  setUser(state, sanityUser) {
    return {
      ...state,
      user: sanityUser.name,
      image: sanityUser.image,
      ref: sanityUser._id
    };
  }
};

export const actions = {
  async updateOrCreate({ state, commit }, user) {
    // Early exit if user is already set in the local state
    // we don't need to triple check this.
    if (state.user && state.ref) {
      return;
    }
    const sanityUser = await this.$axios.$post('/api/user/update-or-create', {
      author: user,
    });
    commit('setUser', sanityUser);
  }
};

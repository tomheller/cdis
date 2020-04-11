const sanityClient = require('@sanity/client');
const blocksToHtml = require('@sanity/block-content-to-html');
const { startingPointsQuery, getChapterById } = require('./queries');
import { nanoid } from 'nanoid';
import { prosemirrorToSanityBlocks } from './prosemirrorToSanity';

// Sanity client initialization
const client = sanityClient({
  projectId: 'ozdxyxjq',
  dataset: 'production',
  // For now this is injected manually, the whole client
  // should be moved to serverless functions
  // based on:
  // https://dev.to/danielroe/using-serverless-functions-in-nuxt-on-zeit-now-4a98
  token: window.localStorage.getItem('SANITY_TOKEN'),
  useCdn: true // `false` if you want to ensure fresh data
});

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
    const story = [
      ...state.story,
      chapter,
    ];
    state.story = story;
    return state;
  },

  updateChapter(state, chapterToUpdate) {
    const selectedChapterIndex = state.story
      .findIndex(ch => ch._id === chapterToUpdate._id);
    state.story[selectedChapterIndex] = chapterToUpdate;
    state.story = [...state.story];
    return state;
  },

  setChoiceForChapter(state, { chapter, reference }) {
    const selectedChapterIndex = state.story
      .findIndex(ch => ch._id === chapter._id);
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
    const entryComponents = await client.fetch(startingPointsQuery);
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

  async chooseContinuation({ commit, state, }, reference) {
    commit('setChoiceForChapter', {
      chapter: state.story[state.story.length - 1],
      reference,
    });

    const nextChapter = await client.fetch(
      getChapterById(reference)
    );

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

  async saveChapter({ dispatch }, { title, content, parentChapter }) {
    // Create the chapter
    const chapter = {
      _type: 'chapter',
      title,
      body: prosemirrorToSanityBlocks(content),
      choices: [],
    };
    const sanityChapter = await client.create(chapter);

    // Create the choice
    const choice = {
      _type: 'choice',
      title,
      continuation: {
        _type: 'reference',
        _ref: sanityChapter._id
      },
    };
    const sanityChoice = await client.create(choice);

    // Add the choice to the chapter being modified.
    const sanityPatchedChapter = await client
      .patch(parentChapter._id)
      .setIfMissing({ choices: [] })
      .insert('after', 'choices[-1]', [{
        _key: nanoid(),
        _ref: sanityChoice._id,
        _type: 'reference',
      }])
      .commit();

    await dispatch('cancelEditMode');
    await dispatch('updateChapter', sanityPatchedChapter._id);
  },

  async updateChapter({ commit }, chapterId) {
    const updatedChapter = await client.fetch(
      getChapterById(chapterId)
    );
    updatedChapter.content = blocksToHtml({
      blocks: updatedChapter.body,
    });
    commit('updateChapter', updatedChapter);
  }
}

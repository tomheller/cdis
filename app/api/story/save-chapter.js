const dotenv = require('dotenv');
dotenv.config();

// Sanity client initialization
const sanityClient = require('@sanity/client');
const client = sanityClient({
  projectId: process.env.SANITY_PROJECTID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const express = require('express');
const prosemirrorToSanityBlocks = require('../util/prosemirrorToSanity');
const nanoid = require('nanoid');
const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.post('/api/story/save-chapter', async function(req, res) {
  const { content, title, author, choiceTitle, parentChapterId } = req.body;
  try {
    // Create the chapter
    const chapter = {
      _type: 'chapter',
      title,
      body: prosemirrorToSanityBlocks(content),
      author: {
        _type: 'reference',
        _ref: author,
      },
      choices: [],
    };
    const sanityChapter = await client.create(chapter);

    // Create the choice
    const choice = {
      _type: 'choice',
      title: choiceTitle,
      continuation: {
        _type: 'reference',
        _ref: sanityChapter._id,
      },
    };
    const sanityChoice = await client.create(choice);

    // Add the choice to the chapter being modified.
    const sanityPatchedChapter = await client
      .patch(parentChapterId)
      .setIfMissing({ choices: [] })
      .insert('after', 'choices[-1]', [
        {
          _key: nanoid(),
          _ref: sanityChoice._id,
          _type: 'reference',
        },
      ])
      .commit();

    res
      .status(200)
      .json(sanityPatchedChapter)
      .end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = app;

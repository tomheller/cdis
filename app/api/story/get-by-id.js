const dotenv = require('dotenv');
dotenv.config();

// Sanity client initialization
const sanityClient = require('@sanity/client');
const client = sanityClient({
  projectId: process.env.SANITY_PROJECTID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: true,
});

const express = require('express');

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.get('/api/story/get-by-id/:id', async function(req, res) {
  const id = req.params.id;
  try {
    const chapter = await client.fetch(`*[_id == "${id}"] {
      _id,
      title,
      body[],
      choices[]->,
      author->,
    }[0]`);

    res
      .status(200)
      .json(chapter)
      .end();
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = app;

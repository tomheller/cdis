const dotenv = require('dotenv');
dotenv.config();

// Sanity client initialization
const sanityClient = require('@sanity/client');
const client = sanityClient({
  projectId: 'ozdxyxjq',
  dataset: 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const express = require('express');
const nanoid = require('nanoid');

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.post('/api/user/update-or-create', async function(req, res) {
  const author = req.body.author;

  try {
    let sanityAuthor = await client.fetch(`*[_type == 'author' && identity == "${author.sub}"] {
      _id,
      name,
      image,
      email
    }[0]`);

    // If the user does not exist, create one
    if (!sanityAuthor) {
      sanityAuthor = await client.create({
        _id: nanoid(),
        identity: author.sub,
        _type: 'author',
        name: author.name,
        image: author.picture,
        email: author.email,
      });
    }

    res
      .status(200)
      .json({ ...sanityAuthor })
      .end();
  } catch(err) {
    res.status(500).end();
  }
});

module.exports = app;

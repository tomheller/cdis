const dotenv = require('dotenv');
const express = require('express');
const nanoid = require('nanoid');
const jwtCheck = require('../util/jwt-auth');
const gql = require('graphql-tag');
const client = require('../util/apollo-fauna-client');
const sanitizeHtml = require('sanitize-html');

dotenv.config();

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.post('/api/story/new-story', jwtCheck, async function(req, res) {
  try {
    const { content, title, author } = req.body;
    const createStoryEntrypoint = gql`
    mutation {
      createChapter(
        data: {
          title: "${title}",
          entryPoint: true,
          author: {
            connect: "${author}"
          },
          body: "${sanitizeHtml(content)}",
          choices: []
        }
      ) {
        _id,
      },
    }
    `;
    const newStoryChapter = await client.mutate({
      mutation: createStoryEntrypoint,
    });
    res
      .status(200)
      .json(newStoryChapter.data.createChapter)
      .end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

module.exports = app;

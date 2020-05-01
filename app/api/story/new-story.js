const dotenv = require('dotenv');
const express = require('express');
const nanoid = require('nanoid');
const jwtCheck = require('../util/jwt-auth');
const gql = require('graphql-tag');
const client = require('../util/apollo-fauna-client');

dotenv.config();

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.post('/api/story/new-story', jwtCheck, async function(req, res) {
  const { content, title, author } = req.body;
  const createStoryEntrypoint = gql`
    mutation {
      createChapter(
        data: {
          id: "${nanoid()}",
          title: "${title}",
          entryPoint: true,
          author: {
            connect: "${author}"
          },
          body: "${content}",
          choices: []
        }
      ) {
        id,
        title,
        author {
          name,
          image,
        },
        body,
        choices {
          title
        },
      },
    }
    `;
  const newStoryChapter = await client.mutate({
    mutation: createStoryEntrypoint,
  });
  try {
    res
      .status(200)
      .json(newStoryChapter.data.createChapter)
      .end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = app;

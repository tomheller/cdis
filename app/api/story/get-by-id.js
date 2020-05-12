const dotenv = require('dotenv');
dotenv.config();
const gql = require('graphql-tag');
const express = require('express');
const client = require('../util/apollo-fauna-client');

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.get('/api/story/get-by-id/', async function(req, res) {
  const id = req.query.id;
  try {
    const getChapter = gql`
      query getChapterById{
        findChapterByID(id: "${id}") {
          _id
          title
          body
          author {
            name
            image
          }
          choices {
            title
            continuation {
              _id
            }
          }
        }
      }
  `;
    const dbChapter = await client.query({ query: getChapter });
    res
      .status(200)
      .json(dbChapter.data.findChapterByID)
      .end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

module.exports = app;

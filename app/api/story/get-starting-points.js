const express = require('express');
const gql = require('graphql-tag');
const client = require('../util/apollo-fauna-client');

const app = express();
app.use(express.json());

const startingPointsQuery = gql`
  query allChapters {
    allChapters {
      before
    }
  }
`;

// It is important that the full path is specified here
app.get('/api/story/get-starting-points', async function(req, res) {
  try {
    const startingPoints = await client.query({ query: startingPointsQuery });

    // const startingPoints = await client.fetch(`*[_type == "chapter" && entryPoint == true ] {
    //   _id,
    //   title,
    //   body[],
    //   choices[]->,
    //   author->,
    // }`);

    res
      .status(200)
      .json(startingPoints)
      .end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = app;

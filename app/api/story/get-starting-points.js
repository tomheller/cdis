const express = require('express');
const gql = require('graphql-tag');
const client = require('../util/apollo-fauna-client');

const app = express();
app.use(express.json());

const startingPointsQuery = gql`
  query findEntryPoints {
    entrypoints(entryPoint: true) {
      data {
        _id
        title
      }
    }
  }
`;

// It is important that the full path is specified here
app.get('/api/story/get-starting-points', async function(_req, res) {
  try {
    const startingPoints = await client.query({ query: startingPointsQuery });
    res
      .status(200)
      .json(startingPoints.data.entrypoints.data)
      .end();
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = app;

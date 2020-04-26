const express = require('express');
const gql = require('graphql-tag');
const client = require('../util/apollo-fauna-client');

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.get('/api/story/get-starting-points', async function(req, res) {
  try {
    const { content, title, author } = req.body;
    const startingPointsQuery = gql`
      mutation {
        createAuthor(
          data: {
            name: author.name,
            identity: author.identity,
            image: author.image,
            email: author.email
          }
        ) {
          _id
        },

      }

    `;
    const newStartingPoint = await client.query({ query: startingPointsQuery });

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

const express = require('express');
const gql = require('graphql-tag');
const client = require('../util/apollo-fauna-client');

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.post('/api/user/update-or-create', async function(req, res) {
  const author = req.body.author;
  try {
    const getAuthor = gql`
    query {
      author(identity: "${author.sub}") {
        _id,
        name,
        image,
        email,
      }
    }
  `;
    let dbAuthor = await client.query({ query: getAuthor });

    // If the user does not exist, create one
    if (!dbAuthor.data.author) {
      const createAuthor = gql`
        mutation {
          createAuthor(
            data: {
              name: "${author.name}",
              identity: "${author.sub}",
              image: "${author.picture}",
              email: "${author.email}",
            }
          ) {
            _id,
            name,
            image,
            email,
          },
        }
      `;
      dbAuthor = await client.mutate({ mutation: createAuthor });
    }

    res
      .status(200)
      .json({ ...dbAuthor.data.author })
      .end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = app;

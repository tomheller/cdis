const dotenv = require('dotenv');
const express = require('express');
const nanoid = require('nanoid');
const gql = require('graphql-tag');
const client = require('../util/apollo-fauna-client');
const sanitizeHtml = require('sanitize-html');
const jwtCheck = require('../util/jwt-auth');

dotenv.config();

const app = express();
app.use(express.json());

// It is important that the full path is specified here
app.post('/api/story/save-chapter', jwtCheck, async function(req, res) {
  const { content, title, author, choiceTitle, parentChapterId } = req.body;
  try {
    const newChapterQuery = gql`
    mutation {
      createChapter(
        data: {
          title: "${title}",
          entryPoint: false,
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
      mutation: newChapterQuery,
    });

    const mutateOriginalChapter = gql`
    mutation addChoice{
      addChoiceToChapter(
        chapterId: "${parentChapterId}",
        choiceTitle: "${choiceTitle}",
        choiceContinuation: "${newStoryChapter.data.createChapter._id}"
      )
      {
        _id
        title
        author {
          name
          email
          image
        }
        body
        choices {
          title,
          continuation {
            _id
          }
        }
      }
    }
    `;
    const updatedChapter = await client.mutate({
      mutation: mutateOriginalChapter,
    });
    res
      .status(200)
      .json(updatedChapter.data.addChoiceToChapter)
      .end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

module.exports = app;

/**
 * A chapter defiens a part of the story, which will end at
 * a branching point where the reader can choose how to
 * progress through the story.
 */
export default {
  name: 'choice',
  title: 'Choice',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'continuation',
      title: 'Continuation',
      type: 'reference',
      to: {
        type: 'chapter',
      },
    },
  ],
};

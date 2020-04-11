/**
 * A chapter defiens a part of the story, which will end at
 * a branching point where the reader can choose how to
 * progress through the story.
 */
export default {
  name: 'chapter',
  title: 'Chapter',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'entryPoint',
      title: 'Entrypoint',
      label: 'Starts off a completely new story',
      type: 'boolean',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {
        type: 'author',
      },
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
    {
      name: 'choices',
      title: 'Choices',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {
            type: 'choice',
          },
        },
      ],
    },
  ],
}

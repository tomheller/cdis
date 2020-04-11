export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'identity',
      title: 'Identity',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
}

export const startingPointsQuery = `*[_type == "chapter" && entryPoint == true ] {
  _id,
  title,
  body[],
  choices[]->,
  author->,
}`;


export const getChapterById = (id) => `*[_id == "${id}"] {
  _id,
  title,
  body[],
  choices[]->,
  author->,
}[0]
`

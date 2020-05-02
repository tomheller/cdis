Map(
Paginate(Documents(Collection('chapters'))),
Lambda(x => Delete(x))
)

## Add choice to chapter function

```
 Query(
  Lambda(
    ["chapterId", "choiceTitle", "choiceContinuation"],
    Update(
      Ref(Collection("chapters"), Var("chapterId")),
      {
        data: {
          choices: Append(
            Select(
              ["data", "choices"],
              Get(Ref(Collection("chapters"), Var("chapterId")))
            ),
            [{ title: Var("choiceTitle"), continuation: Ref(Collection("chapters"), Var("choiceContinuation"))}]
            )
        }
      }
    )
  )
)
```

## Create initial starting point

```
Create(Collection("chapters"), {
  data: {
    author: Ref(Collection("authors"), "264402646287254018"),
    body:
      "<p>Once upon a time, in a far away land there was a small little sloth. The sloth was slow, even for sloth-related speeds.</p><p>One day, the sloth encountered a tree.</p>",
    entryPoint: true,
    id: "437O0nMYOrUOYaZwxfG1O",
    title: "This is the start of our story",
    choices: []
  }
})
```

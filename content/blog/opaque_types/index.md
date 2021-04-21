---
title: Using the type system to your advantage
date: "2021-04-15T22:12:03.284Z"
description: "Using your compiler and type system to become a better developer"
tags: ["Types", "Typescript"]
---

Lately I have been learning a bit more about functional programming and playing around with languages like Haskell and Elm. I am by no means an expert but there are a few cool things I have learned from using their type system and compiler.

Even though I have worked with statically typed languages in the past, like Java and more recenlty Typescript, I don't think I had grasped how important using the compiler and typechecking could be to writting better and more expressive code.

> Imagine this

You wrote fancy function called `fetch` that takes a url, and then returns some sort response object. You might go ahead and do something like this

```typescript
const fetch = (url: string): Promise<Response> => fetch(path)
```

You might think that is totally fine, but there is a problem. Someone else on the team could decide to go ahead and do this

```typescript
fetch("/api/users")
// or
fetch(" /contest")
```

In both examples above, your code would compile and your linter wouldn't event complain. You would only know that your code does not work latter on. There are a few issues with this

1. Using a string is not preventing anyone from making a mistake and typing any `random` string that is not a url.

2. The type `string` does not convey any particular information about what it requires in the context of that function.

3. You could add some sort of validation inside the `fetch` function, but is it actually the `fetch` responsibility to be checking what you call it with?.

4. You could even pass a proper path like `/api/users` but it might still fail because it required the URL to be the full path like `http://somedomain.com/api/users`

All those issues that I listed above are part of a code smell that Martin Fowler and Kent Beck describe in their book "Refactoring: Improving the Design of Existing Code" called **prmitive obsession**, where we are essentially relying too much on type primitives like `string`, `number`, `array` in the case of Typescript.

Even though Typescript is not the best typed language out there, there are a few tricks that we can use to make things better.

> Enter Opaque Types

In a nutshell they are types, just like any custom type you create that expose their definition but hide their constructors (essentially they hide how they get built). Take a look at the code below and read the comments I left.

```typescript
// urlT.ts

// Notice how I am not exporting this

declare const validUrl: unique symbol
type Url = string & {
  [validUrl]: true
}

// Notice how I am exporting this. The only way I am allowing someone to get
// a valid Url type is by invoking this type constructor

export function parseUrl(input: string): asserts input is Url {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  const regex = new RegExp(expression)

  if (!input.match(regex)) {
    throw Error(`${input} is not a valid Url.`)
  }
}
```

In the snippet of code above I created my Url opaque data type. Why is it opaque?. Because the only way you can get a type of Url is by calling `parseUrl` with a string. I am exposing the type Url definition but hiding the way it is built on another module.

...So what is all the fuzz with this opaque type stuff?

```typescript
// Trying to do this won't compile
fetch("http://goo.com")
// Nor this
fetch("foo")

// The only way for it to compile is for me to call
// parseUrl and hence the compiler is forcing me to call my
// parsing function so I can then pass that into the fetch function
const url = "http://google.com/api/users"
parseUrl(url)
fetch(url)
```

The great benefit of all this is that I am forced to parse my input if I want to call my function, which ultimately will enforce your program correctness by telling you not to forget to validate your data and call your methods with the correct information.

There is a great article related to this topic (not necessarily opaque types) that I recommend you go and check out [Parse dont validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/).

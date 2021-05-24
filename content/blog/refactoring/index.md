---
title: Refactoring
date: "2021-05-23T22:12:03.284Z"
description: "Refactoring and some techniques"
tags: ["Refactoring"]
---

</br>

![Banner](./circle.png)


Are you really refactoring code when you say you are refactoring code?. Mmmm... let's take a look at the definition

> Refactoring is a disciplined technique for restructuring and existing body of code, altering its internal structure without changing its external behavior. - Martin Fowler (https://refactoring.com/)

There are 2 things on the definition that are quite important. The first one is about it being a **disciplined technique** (or more so a group of techniques) and the second one is **without changing the external behavior**.

> How do you know you are not changing the external behavior?

The short answer is you don't... **unless you have some way of testing your code**. If you have a codebase that has little or no tests (yes I am also looking at you Mr Frontend), then refactoring code can be really daunting because you can't know for sure if you are changing the behavior and breaking some old code that might be coupled in ways that you can not forsee.

I am a really big proponent of TDD because by starting with a test, you guarantee that your code is testable and that you or someone else can go refactor it with confidence. 

**NOT SURE ABOUT TDD?** check this talk.

`youtube:https://www.youtube.com/watch?v=a6oP24CSdUg`

</br>


> How can we make refactoring a disciplined technique?

There are several books that cover this topic that can help you make it a disciplined practice instead of simply random changes. Martin Fowler and Kent Beck wrote a book called [Refactoring - Improving the design of existing code](https://refactoring.com/) and also, other authors like Sandi Metz, Katrina Owen and TJ Stankus have a great book called [99 Bottles of OOP](https://sandimetz.com/99bottles) where they go over a few other techniques. I want to showcase a few of them with an example, to demonstrate how **refactoring** can be disciplined process.

> Let's check the following code

```typescript
type Action = 'create' | 'update' | 'delete' | 'read'
type Permissions = { [name: string]: Action[]}

// Ugh... nasty any but it is ok for this example. Please don't use anys :D
const getHasPermission = (state: any, name: string, action: Action) => {
  const permissions = getPermissions(state)
  const actions = permissions && permissions[name]
  return Boolean(permissions && actions && actions.includes(action))
}

const checkPermission = (permissions: Permissions, name: string, action: Action) => {
  const actions = permissions ? permissions[name] : null
  return Boolean(permissions && actions && actions.includes(action))
}
```

</br>

We can already see that there is some duplication and ugly conditionals that are making our code not DRY and imperative. On the **99 Bottles of OOP**, the authors describe a set of rules to help of refactor code called **The Flocking Rules** which are

1. Select the things that are most alike
2. Find the smallest difference between them.
3. Make the simplest change that will remove that difference.

> Applying the flocking rules

First, we can see that lines **7,8** are very similar to **12,13**. The smallest difference between those sections is line **7** and **12**. One is using a ternary and the other one is using a boolean short circuit. In reality, both are going to make `const actions` be the same thing when there are permissions, but in the case there are no permissions, on line **7**, actions would be false and on line *12* it would be null. In both scenarios though, it is being used on the line below to check for truthiness. So lets remove the difference


```typescript
const getHasPermission = (state: any, name: string, action: Action) => {
  const permissions = getPermissions(state)
  const actions = permissions ? permissions[name] : null
  return Boolean(permissions && actions && actions.includes(action))
}

const checkPermission = (permissions: Permissions, name: string, action: Action) => {
  const actions = permissions ? permissions[name] : null
  return Boolean(permissions && actions && actions.includes(action))
}
```
</br>


At this point lines **3,4** are identical to **8,9**. Since there is no difference,  we can just have `getHasPermission` call `checkPermission`

```typescript
const getHasPermission = (state: any, name: string, action: Action) => {
  const permissions = getPermissions(state)
  return checkPermission(permissions, name, action)
}

const checkPermission = (permissions: Permissions, name: string, action: Action) => {
  const actions = permissions ? permissions[name] : null
  return Boolean(permissions && actions && actions.includes(action))
}
```
</br>


Now the code is in better shape, we removed the duplication using the *Flocking Rules* but we still have the conditionals on `checkPermission`.

> Removing nullish conditional checks using defaults

If you look closely at line **4**, all that method is asserting is if the action is within an actions array, but we have all this conditional checks and short circuits to account for the fact that values might be *nullish* (null or undefined). To solve this we can simply rely on setting some **defaults**.


```typescript
const checkPermission = (permissions: Permissions, name: string, action: Action) => {
  // When the name is not in permissions, permissions will have an empty entry with an empty array representing the actions. Since there are not actions it will always resolve to false if the permission name does not exist
  const permissions = Object.assign({ [name]: []}, permissions)
  return permissions[name].includes(action)
}
```
</br>


> Why refactor

Refactoring makes your code easier to maintain and reason about. Some of the benefits you will see are

* Eliminates potential sources of bugs by consolidating logic.
* Makes your code more compartmentalized making it more reusable.
* Reduces the [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) by reducing unnecessary conditionals.

And that is it!!. I know I just covered here *The flocking rules* and using *defaults* but there is a lot more techniques you can apply. If you are interested on learning more, here are some resources:

[Martin Fowlers Refactoring Catalog](https://refactoring.com/catalog/) </br>
[Refactoring Guru](https://refactoring.guru/refactoring/catalog)

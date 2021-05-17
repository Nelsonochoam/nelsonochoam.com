---
title: React Generic Components
date: "2021-05-16T22:12:03.284Z"
description: "Building reusable components with composition and generics"
tags: ["React", "Typescript"]
---

</br>

![Banner](./generic.png)

</br>

Recently I had to do some work in which I had to build a few search bars that would trigger some query when the user
typed some input. Then when the results were ready, they had to be displayed in a list. I want to recreate this problem in a
simplified way to showcase how this could be approached using **generic types and component composition** in React. I won't focus
on making it fancy or look pretty. I will skip certain things, specifically:

- I won't debounce the user entering input
- I won't worry about caching server responses
- I won't handle loading states or error states
- I won't handle the scenario for no search results
- I will assume the endpoints always return a nonempty array

I want to focus on the topic of this article, which is using **generics and component composition** to build better reusable components. I will cover
some great ways of representing and handling async data in later posts.

> Lets get started

Let's say we have 2 endpoints that allow us to get some information that we can search on.

- **https://composition.free.beeceptor.com/companies**: This endpoint returns a list of all the companies and we can filter them by `name`

- **https://composition.free.beeceptor.com/jobs**: This endpoint returns a list of all the jobs and we can filter them by `title`

> This is how our types look like

```typescript
// Newtype implementation from newtype-ts library
import { NonNegativeInteger } from "newtype-ts/lib/NonZero"

type CompanyId = NonNegativeInteger

interface Company {
  id: CompanyId
  name: string
}

type JobId = NonNegativeInteger

interface Job {
  id: JobId
  title: string
  description: string
}
```

<br />

As you can see from the types above, **Job** and **Company** have different attributes so the search results must display
different information for each. Regardless, the search functionality would be practically the same

`User types some text -> A query is triggered -> Some results come back`

> The not very reusable approach

I will start building a search that won't be very flexible for both Job and Company searches. Then we'll extract out
what changes and make something that can be composable and reusable for any other kind of search bar.

```jsx
import React, { useState, useEffect } from 'react'

// Company search

const fetchCompanies = (term: string): Promise<Company[]> =>
 fetch(`"https://composition.free.beeceptor.com/companies"?name=${term}`)
 .then(res => res.json())

const CompanySearch = () => {
  const [term, setTerm] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    if (term === '') setData([])
  }, [term])

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value)
    const companies = await fetchCompanies(event.target.value)
    setData(companies)
  }

  return (
    <React.Fragment>
      <label for="company-search">Search Companies</label>
      <input type="search" id="company-search" onChange={handleChange}>
      <ul>
        {data.map(company => (
          <li key={`company-${id}`}>{company.name}</li>
        ))}
      </ul>
    </React.Fragment>
  )
}
```

```jsx
import React, { useState, useEffect } from 'react'
// Job Search

const fetchJobs = (term: string): Promise<Job[]> =>
 fetch(`"https://composition.free.beeceptor.com/jobs"?title=${term}`)
 .then(res => res.json())


const JobSearch = () => {
  const [term, setTerm] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    if (term === '') setData([])
  }, [term])

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value)
    const jobs = await fetchJobs(event.target.value)
    setData(jobs)
  }

  return (
    <React.Fragment>
      <label for="job-search">Search Jobs</label>
      <input type="search" id="job-search" onChange={handleChange}>
      <ul>
        data.map(job => (
          <li key={`job-${job.id}`}>
            <p>{job.title}</p>
            <p>{job.description}</p>
          </li>
        ))
      </ul>
    </React.Fragment>
  )
}
```

<br />

Both components mostly do the same thing except for where they fetch the data from
and how they display the results. When rendered, they will look like this:

```jsx
const Layout = () => {
  return (
    <React.Fragment>
      <SearchCompanies />
      <SearchJobs />
    </React.Fragment>
  )
}
```

<br />

Let's try to make this composable by using **eneric types and component composition**.

> Composition and generics

If you don't know what I am talking about, you can check the [React docs](https://reactjs.org/docs/composition-vs-inheritance.html]) and also
watch the video by [Michael Jackson](https://twitter.com/mjackson) (not the singer) below, where he talks about state management using component composition and lifting components.

`youtube:https://www.youtube.com/watch?v=3XaXKiXtNjw`

Alright, here is how we could rewrite the search to make it a reusable component using generic types and
composition.

```jsx
import React, { useState, useEffect } from 'react'

interface Props<T> {
  id: string
  label: string
  children: (item: T) => React.ReactNode
  fetchItems: (term: string) => Promise<T[]>
}

const Search = <T,>({ id, label, fetchItems, children }: Props<T>) => {
  const [term, searchTerm] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    if (term === '') setData([])
  }, [term])

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value)
    const items = await fetchItems(event.target.value)
    setData(items)
  }

  return (
    <React.Fragment>
      <label for={id}>{label}</label>
      <input type="search" id={id} onChange={handleChange}>
      <ul>
        data.map(children)
      </ul>
    </React.Fragment>
  )
}
```

<br />

Notice how on our `Search` component we are defining a **generic type** `T` which gets passed to `Props<T>`. When
we pass `fetchCompanies` to Search, `T` will become our `Company` type. Here is how the compiler would resolve our types

```typescript
declare function fetchCompanies(term: string): Promise<Company[]>

// This will cause the compiler to resolve props as

interface Props {
  id: string
  label: string
  children: (item: Company) => React.ReactNode
  fetchItems: (term: string) => Promise<Company[]>
}
```

<br />

> The composition part

The **children** prop is a mechanism React provides to do component composition. Whatever you place inside the open and
closing brackes of a component will become the `children` props of that component. Knowing that, we could use it to compose
our `Search` component with how we want the search results to display for `Company` and `Job` types

```jsx
const Layout = () => {
  return (
    <React.Fragment>
      <Search
        id="companies"
        label="Search Companies"
        fetchItems={fetchCompanies}
      >
        {/* Composition happening here */}
        {company => <li key={`company-${company.id}`}>{company.name}</li>}
      </Search>
      <Search id="jobs" label="Search Jobs" fetchItems={fetchJobs}>
        {/* Composition happening here */}
        {job => (
          <li key={`job-${job.id}`}>
            <p>{job.title}</p>
            <p>{job.description}</p>
          </li>
        )}
      </Search>
    </React.Fragment>
  )
}
```

<br />

One cool thing about using component composition like this, is that it lifts the search results to the same level where the
`Search` component is defined and it help us prevent prop drilling. Now we can have different `onClick` events for
`Jobs` vs `Companies` like this

```jsx
import React from "react"

const Layout = () => {
  const checkoutCompany = (company: Company) => {
    console.log("I am going to check this company")
  }

  const applyForJob = (job: Job) => {
    console.log("I am going to apply for this job")
  }

  return (
    <React.Fragment>
      {/* Company Search */}
      <Search
        id="companies"
        label="Search Companies"
        fetchItems={fetchCompanies}
      >
        {company => (
          <li
            key={`company-${company.id}`}
            onClick={() => checkoutCompany(company)}
          >
            {company.name}
          </li>
        )}
      </Search>
      {/* Job Search */}
      <Search id="jobs" label="Search Jobs" fetchItems={fetchJobs}>
        {job => (
          <li key={`job-${job.id}`} onClick={() => applyForJob(job)}>
            <p>{job.title}</p>
            <p>{job.description}</p>
          </li>
        )}
      </Search>
    </React.Fragment>
  )
}
```

<br />

With this pattern, we could easily have different search bars that search for different entities and even have them execute
different actions when you click them depending on the context. As shown in the example above, we could easily replace the
`onClick` functions and have the search bar results act differently depending on where you use them.

---
title: Type Driven Development
date: "2021-05-03T22:12:03.284Z"
description: "Using types to represent your domain"
tags: ["Types", "Design"]
---

You have heard of TDD as in test driven development but have you heard of type driven development?. To put it simply, it consists on defining your types first and describing with types your business constraints before you even write implementations. _If you just want to watch a video I recommend watching a talk by Scott Wlaschin on Domain Modeling Made Functional (below)_

`youtube:https://www.youtube.com/watch?v=2JB1_e5wZmU`

</br>

> Let's just jump to an example

Imagine you are tasked with building a form where users can order food and decide whether they want to order for pickup or delivery

1. Name and phone are always required
2. If they choose delivery, an address is required, and they must pay with credit card
3. If they choose pickup and address is NOT required and the user can pay with credit card or cash at the store

So using a naive approach we can start with something like this

```typescript
interface MenuItem {
  name: string
  price: number
}

interface Order {
  name: string
  phone: string
  address?: string
  type: "pickup" | "delivery"
  payment: "credit" | "cash"
  items: MenuItem[]
}
```

</br>

I am sure a lot of people would go that route and then start either writting a test if you are doing TDD or simply jumping to the implementation. (I have been gulty of doing that as well). We can do better than that, lets make some adjustments

```typescript
type Opaque<K, T> = T & { __TYPE__: K }
// NOTE: Thisis just an example and we would have to provide
// type constructors and move this types into their own files
// to actually make them opaque.
type Name = Opaque<"Name", string>
type Phone = Opaque<"Phone", string>
type Address = Opaque<"Address", string>

type CustomerInfo = {
  name: Name
  phone: Phone
}

type Currency = "CAD" | "USD"

type Dollars = {
  amount: number
  currency: Currency
}

type MenuItem = {
  name: string
  price: Dollars
}

type PickUpOrder = CustomerInfo & {
  type: "pickup"
  payment: "credit" | "cash"
  items: MenuItem[]
}

type DeliveryOrder = CustomerInfo & {
  type: "delivery"
  address: Address
  payment: "credit"
  items: MenuItem[]
}

type Order = PickUpOrder | DeliveryOrder
```

</br>

Notice the HUGE difference now, just by looking at this types we can tell a completely different story. Now we know orders should always have `CustomerInfo`. The `Name`, `Phone`, `Address` are more than just strings, the customer requires an `Address` for `DeliveryOrders` and payment options are now different depending on the type of order.

> Here is what you will gain by thinking about types first

- Figure out the domain language beforehand and make sure you are using the same language subject matter experts are using to name things in your code.
- Model business contraints before even writting the first line of implementation.
- Ensure you are not having to do extra checks for undefined like `if order.address` just because you did not represent your models properly.

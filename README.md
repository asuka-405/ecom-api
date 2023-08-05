# ecom-api

An API simulating how operations are done at the backend in an e-commerce website

## Features

- Public store view
- Private cart view
- Order placements
- Rate limiter in place
- Code with JSDOC
- JWT based authentication

## Prerequisites

- NodeJS v18.16.0 or higher
- MongoDB community server v^6.0.8 or a MongoDB cloud account

## Setup

- install yarn

```
npm install yarn --location=global
```

- install dependencies

```
yarn install
```

## Commands

- run mongodb server

```
yarn mongod
```

- start api

```
yarn dev
```

## Endpoints

- auth

  - /auth/login : login user with email and password then return a JWT
  - /auth/register : register user and their password after checking that that he does not already exists

- store

  - /store : fetch products
  - /store/categories : fetch all possible categories
  - /store/product/:id : fetch product by id (replace ":id" with product id, 1,3,4...)

- cart
  - /cart : fetch products currently present in cart
  - /cart/add/:id : fetch product with id=:id and add it to cart
  - /cart/remove/:id : fetch product with id=:id and remove it from cart if present
  - /cart/checkout : fetch cart, place order for items in cart and clear the cart
  - /cart/history : fetch previously placed orders.

# Product Manager API – Node.js, Express, TypeScript and PostgreSQL

A REST API for managing products, built with **Node.js**, **Express 5** and **TypeScript**. It stores the products in **PostgreSQL** through **Sequelize**, validates every request, documents itself with **Swagger**, and is covered by integration tests written with **Jest** and **Supertest**.

This is **Project 10** of the Udemy course [React de Principiante a Experto](https://www.udemy.com/course/react-de-principiante-a-experto-creando-mas-de-10-aplicaciones/). It is the backend of a full-stack app whose React client lives in [its own repository](https://github.com/TarekM-7/product-manager-client). The goal of this project is to build a REST API from scratch with TypeScript, connect it to a real database, test it, document it and deploy it.

![The Swagger UI page under a blue top bar with a globe logo: the title "REST API Node.js / Express / Typescript" with version 1.0.0 and OAS 3.0 badges, and the Products section listing the six endpoints with color-coded GET, POST, GET, PUT, PATCH and DELETE labels, followed by the Product schema](docs/screenshot.png)

**Live demo:** [the app on Vercel](https://fullstack-project-node-react-typesc.vercel.app/) · [the API docs on Render](https://fullstack-project-node-react-typescript.onrender.com/docs/)

> **Hosting:** the API and its PostgreSQL database run on [Render](https://render.com/), and the React client on [Vercel](https://vercel.com/), all on free plans. A free service can go to sleep when nobody is using it, so the first request may take a while to answer, and the live demo may stop working at some point.

## Features

- Full CRUD for products: list, get one, create, update, toggle availability and delete.
- Every request is validated. Invalid input gets a `400` with the list of errors.
- A `404` with a clear message when a product does not exist.
- New products are available by default.
- Interactive API documentation with Swagger UI at `/docs`.
- CORS that only lets the client's website read the API from a browser.
- HTTP request logging with Morgan.
- 20 integration tests that cover every endpoint and its error cases.

## Tech Stack

- [Node.js](https://nodejs.org/) and [Express 5](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) with [Sequelize](https://sequelize.org/) and [sequelize-typescript](https://github.com/sequelize/sequelize-typescript)
- [express-validator](https://express-validator.github.io/) for request validation
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) for the OpenAPI docs
- [cors](https://github.com/expressjs/cors), [morgan](https://github.com/expressjs/morgan) and [dotenv](https://github.com/motdotla/dotenv)
- [Jest](https://jestjs.io/), [ts-jest](https://kulshekhar.github.io/ts-jest/) and [Supertest](https://github.com/ladjs/supertest) for testing
- [tsx](https://tsx.is/) to run TypeScript in development

## How It Works

| Method | Route | What it does | Success |
|---|---|---|---|
| `GET` | `/api/products` | List every product, newest first | `200` |
| `GET` | `/api/products/:id` | Get one product | `200` |
| `POST` | `/api/products` | Create a product from `name` and `price` | `201` |
| `PUT` | `/api/products/:id` | Replace `name`, `price` and `availability` | `200` |
| `PATCH` | `/api/products/:id` | Toggle `availability` | `200` |
| `DELETE` | `/api/products/:id` | Delete a product | `200` |

Successful responses are wrapped in `{ data }`. Validation errors come back as `{ errors }` with a `400`, and a missing product as `{ error }` with a `404`.

Every request goes through the same pipeline:

```
Request
  ├─ cors            → only the client's origin is allowed
  ├─ express.json    → parses the JSON body
  ├─ morgan          → logs the method, route, status and time
  └─ /api/products   → router
        ├─ express-validator rules on the body and the URL params
        ├─ handleInputErrors → 400 { errors } if a rule failed
        └─ handler → Product model (Sequelize) → PostgreSQL
                     (no product → 404 { error })
```

When the server starts, it connects to the database and creates the `products` table if it does not exist yet. The Swagger docs are generated from the OpenAPI comments written above each route in `router.ts`.

## Project Structure

```
src/
├── __tests__/
│   └── server.test.ts        # Database connection error, with a mocked connection
├── config/
│   ├── db.ts                 # Sequelize connection and model loading
│   └── swagger.ts            # OpenAPI definition and Swagger UI options
├── data/
│   └── index.ts              # Script that resets the database (--clear)
├── handlers/
│   ├── __tests__/
│   │   └── product.test.ts   # Integration tests for every endpoint
│   └── product.ts            # One handler per endpoint
├── middleware/
│   └── index.ts              # Returns the validation errors as a 400
├── models/
│   └── Product.model.ts      # Products table defined with decorators
├── index.ts                  # Starts the server
├── router.ts                 # Routes, validation rules and OpenAPI comments
└── server.ts                 # Express app, middleware and database connection
```

## What I Learned

- **Setting up a TypeScript backend.** `tsx` runs the source directly in development and restarts on every change, while `tsc` compiles it to `dist/` for production. Along the way I learned to check tool compatibility: `ts-node` and `ts-jest` do not support TypeScript 7 yet, so the project uses TypeScript 6.
- **Structuring an Express app in layers.** `index.ts` starts the server, `server.ts` builds the app, the router defines the routes, and each handler talks to the model. Every layer has a single job.
- **Designing a REST API.** Each HTTP method has a meaning, and each response has the status code that fits it: `201` when something is created, `400` for bad input, `404` when it does not exist. `PUT` replaces a product, while `PATCH` only changes one field.
- **Validating on the server.** Client-side validation helps the user, but only the server's validation protects the data, because anyone can call the API without going through the client.
- **Using a database through an ORM.** Sequelize maps a TypeScript class to a table, and decorators like `@Default(true)` define its columns. `sync()` creates missing tables but does not change existing ones, while `sync({ force: true })` drops and recreates them.
- **Testing an API.** Supertest sends real requests to the app. To test the database error path, `jest.spyOn(...).mockRejectedValueOnce(...)` makes the connection fail on purpose.
- **Code coverage and its limits.** Coverage measures which statements, branches, functions and lines the tests ran. It only counts the files the tests import, so 100% does not mean the whole project is tested.
- **Documenting with OpenAPI.** swagger-jsdoc reads YAML written inside comments, where indentation is part of the syntax. Customizing Swagger UI taught me about CSS specificity, and that `flex-basis` wins over `width` in a flex item.
- **CORS.** The browser sends an `Origin` header and the server decides whether that website may read the response. Requests with no `Origin`, like opening a URL directly, Postman or the Swagger page, are let through, since they do not come from another website. CORS protects users from other websites; it is not authentication, because outside a browser anyone can send any `Origin` they want.
- **Deploying.** Secrets live in environment variables on the hosting platform, never in the code. The compiled build runs `.js` files, so the models path cannot point only at `.ts` files.

## Getting Started

Requirements: [Node.js](https://nodejs.org/) 20 or later and a [PostgreSQL](https://www.postgresql.org/) database, either local or hosted.

```bash
# Clone the repository
git clone https://github.com/TarekM-7/product-manager-server.git
cd product-manager-server

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# then set DATABASE_URL and FRONTEND_URL in .env

# Start the dev server
npm run dev
```

The API runs on `http://localhost:4000` and its documentation on `http://localhost:4000/docs`.

Other scripts:

```bash
npm run build           # Compile TypeScript to dist/
npm start               # Run the compiled build
npm test                # Reset the database and run the tests
npm run test:coverage   # Same, with a coverage report
```

> Warning: `npm test` first runs a `pretest` script that **drops and recreates every table**. Point `DATABASE_URL` at a development database before running the tests, never at the production one.

## Acknowledgements

Project idea and design come from the Udemy course linked above. I wrote the implementation while following the course and adapted it as I learned.


# Table of Contents
- [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Swagger](#swagger)
  - [Prisma](#prisma)
  - [Using Docker](#using-docker)

## Getting Started

Start off by copying `.envtemplate` and renaming the copy to `.env`. Configure the node env and databse dev/prod URI's based on your current environment and secrets. See Prisma documentation for more information of database URL.

If you don't have yarn and/or node on your system, run `brew install yarn` if you have homebrew installed. Alternatively, if you already have node you can also run `sudo npm i -g yarn`.

Now, run `yarn install` to install all dependencies. Once that finishes, you're all set to run the backend!

Simply use `yarn backend` to begin running the dev server locally, or `yarn build` to create a production build that can be run using `yarn start`

This backend is centered around the MVC (model-view-controller) design pattern, intended to decouple code and reduce potential errors with the system.

The backend also comes preconfigured with a jest test suite that will execute on PR creation. The jest suite is integrated with supertest and is located in `backend/tests` and can be run using `yarn test`. 

> Note: The backend is currently configured to run on port 8000. Ensure you kill this server before you run `yarn test` to avoid port conflicts.

The backend is generally structured as follows:
- `backend/src` -- contains all of the source code for the backend
- `backend/prisma` -- contains all of the prisma schema and migration files
- `backend/tests` -- contains all of the jest test suite

In `backend/src` you will find the the initialization of express app, the routes, and the controllers. The controllers are where the bulk of the logic for the backend is located. The folder names are self-explanatory, and the files within them are named based on the route and controllers they are associated with.

## Swagger 

`backend/src` also contains swagger, which is currently configured to automically generate documentation for the backend. To view the documentation, run `yarn swagger` and then navigate to `localhost:8000/api-docs` in your browser. This step is important becuase it will auto-generate the swagger.json file that is used to generate the documentation.

In order to structure our swagger documentation properly, ensure that you add the `#swagger.tags = ['name of section']` comment to the top of each function in the controller file. This will ensure that the swagger documentation is properly organized. For example, if you have a controller file that contains all of the routes for the `users` entity, you should add the following comment to the top of each method:
```js
// #swagger.tags = ['Users']
```
Swagger is useful for us because we can then import the swagger.json file into Postman and use it to generate a collection of requests that we can use to test our backend. To do this, simply import the api-docs.json file into Postman and it will automatically generate a collection of requests for you.

## Prisma
This backend makes use of Prisma, a database toolkit that allows us to easily create and manage our database schema. To learn more about Prisma, check out their <a href="https://www.prisma.io/docs/">documentation</a>. The documentation is really well written and easy to follow.

The major components we are using are: 
- Prisma Client -- a type-safe database client that allows us to easily query our database
- Prisma Migrate -- a database migration tool that allows us to easily create and manage our database schema
- Prisma Studio -- a GUI that allows us to easily view and edit our database schema

The Prisma schema is located in `backend/prisma/schema.prisma`. This file contains all of the models and relationships between them. To learn more about the Prisma schema, check out <a href="https://www.prisma.io/docs/concepts/components/prisma-schema">this page</a> on the Prisma website.

To create a new migration, run `yarn prisma migrate dev --name <name of migration>`. This will create a new migration file in `backend/prisma/migrations`. To apply the migration to your database, run `yarn prisma migrate deploy`. To view the current state of the database, run `yarn prisma studio`.

`backend/prisma/seed.ts` contains a script that will seed the database with some dummy data. To run this script, run `yarn prisma seed`. 


## Using Docker
This backend can also be easily dockerized. Once you've created your env file, simply run `docker compose up -d` or `docker compose up` to start up the application (make sure the docker daemon is running).

If this fails, try running `docker system prune`. The application should begin running at port 8000 on your local machine.

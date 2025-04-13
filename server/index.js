const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

async function startServer() {
  const app = express();
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs: `
      type User{
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
      }

      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!):User
      }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  await server.start();

  app.use(cors());

  app.use("/graphql", expressMiddleware(server));

  app.listen(6050, () =>
    console.log("Server at http://localhost:6050/graphql")
  );
}

startServer();

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const bodyParser = require("body-parser");

async function startServer() {
  const app = express();
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs: `
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
      }

      type Query {
        getTodos: [Todo]
      }
    `,
    resolvers: {
      Query: {
        getTodos: () => [
          { id: "1", title: "something something", completed: false },
        ],
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

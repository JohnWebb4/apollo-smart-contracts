const cors = require("cors");
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const { context, resolvers, typeDefs } = require("./src/schema");

const PORT = process.env.PORT || 8080;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

  const app = express();

  app.use(cors());

  app.use(express.static("public"));

  await server.start();

  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startApolloServer();

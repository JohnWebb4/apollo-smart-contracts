require("dotenv").config();
const { ApolloServer } = require("apollo-server");

const { context, resolvers, typeDefs } = require("./src/schema");
const { initContractWorker } = require("./src/services/worker.service");
require("./src/services/worker.service");
const { initDB } = require("./src/utils/mongo.util");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(async ({ url }) => {
  await initDB();
  initContractWorker();

  if (process.env.NODE_ENV == "development") {
    console.info(`Listening on port ${url}`);
  }
});

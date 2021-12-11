require("dotenv").config();
const { ApolloServer } = require("apollo-server");

const { context, resolvers, typeDefs } = require("./src/schema");
require("./src/services/worker.service");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`listening on port ${url}`);
});

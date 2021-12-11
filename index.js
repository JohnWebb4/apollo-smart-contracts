require("dotenv").config();
const { ApolloServer } = require("apollo-server");

const { context, resolvers, typeDefs } = require("./src/schema");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`listening on port ${url}`);
});

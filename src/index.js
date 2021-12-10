const { ApolloServer } = require("apollo-server");

const { context, resolvers, typeDefs } = require("./schema");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});

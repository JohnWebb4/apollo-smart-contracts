const { gql } = require("apollo-server");

const { User, userResolvers, userMutations } = require("./resolvers/user");

const BaseSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [BaseSchema, User];

const resolvers = {
  ...userResolvers,
};

module.exports = { resolvers, typeDefs };

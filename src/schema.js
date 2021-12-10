const { gql } = require("apollo-server-express");

const { getAuthContext } = require("./context/auth.context");
const {
  User,
  userResolvers,
  userMutations,
} = require("./resolvers/user.resolver");

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

function context({ req, res }) {
  const authContext = getAuthContext({ req, res });

  return {
    ...authContext,
  };
}

module.exports = { context, resolvers, typeDefs };

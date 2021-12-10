const { gql } = require("apollo-server");

const User = gql`
  extend type Query {
    user(address: String!): User
    me: User
  }

  extend type Mutation {
    signup(input: UserInput!): User
    updateMe(input: UserInput!): User
  }

  type User {
    id: ID! # chainId:address
    chainId: Int!
    address: String!
    username: String
    name: String
    twitter: String
  }

  input UserInput {
    username: String
    name: String
    twitter: String
  }
`;

const userResolvers = {
  Query: {
    user: userResolver,
  },
  Mutation: {
    signup: signUpMutation,
    updateMe: updateMeMutation,
  },
};

function userResolver(parents, args, context) {
  const { id } = args;

  console.log("context", context);

  // TODO

  return {
    address: "addressUser",
    chainId: 123,
  };
}

function signUpMutation(parents, args, context) {
  const { input } = args;

  // TODO

  return {
    address: "addresssSignUp",
    chainId: 123,
  };
}

function updateMeMutation(parents, args, context) {
  const { input } = args;

  // TODO

  return {
    address: "addressUpdate",
    chainId: 123,
  };
}

const userMutations = {};

module.exports = { User, userMutations, userResolvers };

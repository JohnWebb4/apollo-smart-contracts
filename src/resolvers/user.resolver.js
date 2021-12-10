const { gql } = require("apollo-server-express");

const { getId } = require("../services/user.service");

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
    me: meResolver,
    user: userResolver,
  },
  Mutation: {
    signup: signUpMutation,
    updateMe: updateMeMutation,
  },
};

function meResolver(parents, args, context) {
  const { chain, user } = context;

  const id = getId(chain.id, user.address);

  // TODO

  return {
    address: user.address,
    chainId: chain.id,
    id: id,
  };
}

function userResolver(parents, args, context) {
  const { address } = args;
  const { chain, user } = context;

  const id = getId(chain.id, user.address);

  // TODO

  return {
    address: user.address,
    chainId: chain.id,
    id,
  };
}

function signUpMutation(parents, args, context) {
  const { input } = args;
  const { chain, user } = context;

  const id = getId(chain.id, user.address);

  // TODO

  return {
    address: user.address,
    chainId: chain.id,
    id,
  };
}

function updateMeMutation(parents, args, context) {
  const { input } = args;
  const { chain, user } = context;

  const id = getId(chain.id, user.address);

  // TODO

  return {
    address: user.address,
    chainId: chain.id,
    id,
  };
}

const userMutations = {};

module.exports = { User, userMutations, userResolvers };

const { gql } = require("apollo-server-express");

const {
  getId,
  getUser,
  signupUser,
  updateUser,
} = require("../services/user.service");
const { RequestError } = require("../errors/request.error");

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

async function meResolver(_parents, _args, context) {
  const { chain, user } = context;

  try {
    const me = await getUser(chain.id, user.address);

    return me;
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

async function userResolver(_parents, args, context) {
  const { address } = args;
  const { chain } = context;

  try {
    const user = await getUser(chain.id, address);

    return user;
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

async function signUpMutation(_parents, args, context) {
  const { input } = args;
  const { chain, user } = context;

  try {
    const id = getId(chain.id, user.address);

    const userInput = {};

    // Possibly do more sanitization here on input
    userInput.id = id;
    userInput.username = input.username;
    userInput.name = input.name;
    userInput.twitter = input.twitter;

    const signUpUser = await signupUser(userInput);

    return signUpUser;
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

async function updateMeMutation(_parents, args, context) {
  const { input } = args;
  const { chain, user } = context;

  try {
    const id = getId(chain.id, user.address);

    const userInput = {};

    // Possibly do more sanitization here on input
    userInput.id = id;
    userInput.username = input.username;
    userInput.name = input.name;
    userInput.twitter = input.twitter;

    const updatedUser = await updateUser(userInput);

    return updatedUser;
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

const userMutations = {};

module.exports = { User, userMutations, userResolvers };

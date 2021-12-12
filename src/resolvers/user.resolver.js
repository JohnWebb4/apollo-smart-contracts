const { gql } = require("apollo-server-express");

const {
  getId,
  getUser,
  signupUser,
  updateUser,
  validateUserInput,
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

/**
 * Fetch the current user
 * @param {undefined} _parents none
 * @param {undefined} _args none
 * @param {Context} context auth context
 * @returns {Promise<User>} current user
 */
function meResolver(_parents, _args, context) {
  const { chain, user } = context;

  try {
    return getUser(chain, user.address);
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

/**
 * Fetch details on the selected user
 * @param {undefined} _parents none
 * @param {{ address: string }} args the user's address
 * @param {Context} context auth context
 * @returns {Promise<User>} user
 */
function userResolver(_parents, args, context) {
  const { address } = args;
  const { chain } = context;

  try {
    return getUser(chain, address);
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

/**
 * Signup a new user
 * @param {undefined} _parents none
 * @param {{ input: UserInput }} args new user information
 * @param {Context} context auth context
 * @returns {Promise<User>} Signed up user
 */
function signUpMutation(_parents, args, context) {
  const { input } = args;
  const { chain, user } = context;

  try {
    validateUserInput(input);

    const userInput = {};

    userInput.address = user.address;
    userInput.username = input.username;
    userInput.name = input.name;
    userInput.twitter = input.twitter;

    return signupUser(chain, userInput);
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

/**
 * Update current user
 * @param {undefined} _parents none
 * @param {{ input: UserInput }} args updated information
 * @param {Context} context auth context
 * @returns {Promise<User>} updated user
 */
function updateMeMutation(_parents, args, context) {
  const { input } = args;
  const { chain, user } = context;

  try {
    validateUserInput(input);

    const userInput = {};

    userInput.address = user.address;
    userInput.username = input.username;
    userInput.name = input.name;
    userInput.twitter = input.twitter;

    return updateUser(chain, userInput);
  } catch (error) {
    throw new RequestError(error.message, error.statusCode || 500);
  }
}

module.exports = { User, userResolvers };

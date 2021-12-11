const ethers = require("ethers");

const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const { RequestError } = require("../errors/request.error");
const { getContract } = require("../utils/ethers.util");
const {
  isAlphaNumeric,
  isXCharactersOrLess,
} = require("../utils/validator.util");
const { addContractEvent } = require("./worker.service");

const nameLength = 50; // Arbitrary
const twitterHandleLength = 15; // Source: https://help.twitter.com/en/managing-your-account/twitter-username-rules#:~:text=Your%20username%20cannot%20be%20longer,for%20the%20sake%20of%20ease
const usernameLength = 15; // Arbitrary

/**
 * Get user
 * @param {string} chainId chain id
 * @param {string} address user address
 * @returns {User} user
 */
async function getUser(chainId, address) {
  const id = getId(chainId, address);

  // TODO

  return {
    address,
    chainId,
    id,
  };
}

/**
 * Signup user
 * @param {{ address: string, username: string, name: string, twitter: string }} userInput user to create
 * @returns {User} created user
 */
async function signupUser({ address, username, name, twitter }) {
  const identityManagerContract = getContract(
    ethers.utils.getAddress("0xA914dDfa731A47Afb2704Af36b737Fefc4464CcA"),
    IdentityManagerContractABI,
    {
      signed: true,
    }
  );

  const result = await identityManagerContract.createIdentity(
    ethers.utils.getAddress(address),
    username,
    name,
    twitter
  );
}

/**
 * Update the current user
 * @param {{address: string, username: string, name: string, twitter: string }} userInput user to update
 * @returns {User} updated user
 */
async function updateUser({ address, username, name, twitter }) {
  const identityManagerContract = getContract(
    address,
    IdentityManagerContractABI,
    {
      signed: true,
    }
  );

  const result = await identityManagerContract.updateIdentity(
    ethers.utils.getAddress(address),
    username,
    name,
    twitter
  );
}

/**
 * Get a unique id for the user on the current chain
 * @param {string} chainId id of the chain
 * @param {string} address address of the user
 * @returns {string} unique id
 */
function getId(chainId, address) {
  return `${chainId}:${address}`;
}

/**
 * Validate user input
 * @param {UserInput} input user input
 * @throws {RequestError} throws if input is malformed
 */
function validateUserInput({ name, twitter, username }) {
  if (name) {
    if (!isXCharactersOrLess(name, nameLength)) {
      throw new RequestError("Name is invalid", 400);
    }
  }

  if (twitter) {
    if (
      !isAlphaNumeric(twitter) ||
      !isXCharactersOrLess(twitter, twitterHandleLength)
    ) {
      throw new RequestError("Twitter handle is invalid", 400);
    }
  }

  if (username) {
    if (
      !isAlphaNumeric(username) ||
      !isXCharactersOrLess(username, usernameLength)
    ) {
      throw new RequestError("Username is invalid", 400);
    }
  }
}

module.exports = {
  getId,
  getUser,
  signupUser,
  updateUser,
  validateUserInput,
};

const ethers = require("ethers");

const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const { RequestError } = require("../errors/request.error");
const { getUserFromEvents } = require("../resources/contractEvent.resource");
const { getId } = require("../resources/user.resource");
const { getContract } = require("../utils/ethers.util");
const {
  isAlphaNumeric,
  isXCharactersOrLess,
} = require("../utils/validator.util");
const { addIndexContractEvent } = require("./worker.service");

const nameLength = 50; // Arbitrary
const twitterHandleLength = 15; // Source: https://help.twitter.com/en/managing-your-account/twitter-username-rules#:~:text=Your%20username%20cannot%20be%20longer,for%20the%20sake%20of%20ease
const usernameLength = 15; // Arbitrary

/**
 * Get user
 * @param {string} chainId chain id
 * @param {string} address user address
 * @returns {Promise<User>} user User at address
 */
function getUser(chain, address) {
  const id = getId(chain.id, address);

  return getUserFromEvents(id);
}

/**
 * Signup user
 * @param {{ address: string, username: string, name: string, twitter: string }} userInput user to create
 * @returns {User} created user
 */
async function signupUser(chain, { address, username, name, twitter }) {
  const id = getId(chain.id, address);

  const currentUser = await getUserFromEvents(id);

  if (!currentUser) {
    const identityManagerContract = getContract(
      chain.name,
      ethers.utils.getAddress(chain.identityAddress),
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

    // TODO: Transform result to user

    addIndexContractEvent({ chain });

    return {
      id,
    };
  } else {
    throw new RequestError("User address already exists", 400);
  }
}

/**
 * Update the current user
 * @param {{address: string, username: string, name: string, twitter: string }} userInput user to update
 * @returns {User} updated user
 */
async function updateUser(chain, { address, username, name, twitter }) {
  const id = getId(chain.id, address);

  const currentUser = await getUserFromEvents(id);

  if (currentUser) {
    const identityManagerContract = getContract(
      chain.name,
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

    // TODO: Transform result to user

    addIndexContractEvent({ chain });

    return {
      id,
    };
  } else {
    throw new RequestError("User does not exist", 400);
  }
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

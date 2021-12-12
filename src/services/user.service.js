const {
  CONTRACT_EVENT_COLLECTION_NAME,
  CONTRACT_EVENTS,
} = require("../constants/contractEvent.constant");
const { CONTRACT_JOBS } = require("../constants/contractJob.constant");
const { RequestError } = require("../errors/request.error");
const { getUserFromEvents } = require("../resources/contractEvent.resource");
const { getId } = require("../resources/user.resource");
const { getBlockNumber } = require("../utils/ethers.util");
const { writeDocument } = require("../utils/mongo.util");
const {
  isAlphaNumeric,
  isXCharactersOrLess,
} = require("../utils/validator.util");
const { addContractJob } = require("./worker.service");

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
    await writeDocument(CONTRACT_EVENT_COLLECTION_NAME, {
      id,
      blockNumber: await getBlockNumber(chain.name),
      eventName: CONTRACT_EVENTS.pendingCreateIdentity,
      username,
      name,
      twitter,
    });

    addContractJob({
      id,
      jobName: CONTRACT_JOBS.signupUser,
      username,
      name,
      twitter,
    });

    return getUserFromEvents(id);
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
    await writeDocument(CONTRACT_EVENT_COLLECTION_NAME, {
      id,
      blockNumber: await getBlockNumber(chain.name),
      eventName: CONTRACT_EVENTS.pendingUpdateIdentity,
      username,
      name,
      twitter,
    });

    addContractJob({
      id,
      jobName: CONTRACT_JOBS.updateUser,
      username,
      name,
      twitter,
    });

    return getUserFromEvents(id);
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

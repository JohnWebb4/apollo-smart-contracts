const ethers = require("ethers");

const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const { getContract } = require("../utils/ethers.util");
const { addContractEvent } = require("./worker.service");

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

module.exports = {
  getId,
  getUser,
  signupUser,
  updateUser,
};

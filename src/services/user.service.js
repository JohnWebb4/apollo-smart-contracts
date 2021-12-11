const ethers = require("ethers");

const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const {
  recoverSignatureAddress,
  getContract,
} = require("../utils/ethers.util");
const { addContractEvent } = require("./worker.service");

function getSignatureUser(signature, url) {
  const address = recoverSignatureAddress({ signature, url });

  if (address) {
    return { address };
  }

  return undefined;
}

async function getUser(chainId, address) {
  const id = getId(chainId, address);

  // TODO

  return {
    address,
    chainId,
    id,
  };
}

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

function getId(chainId, address) {
  return `${chainId}:${address}`;
}

module.exports = {
  getId,
  getSignatureUser,
  getUser,
  signupUser,
  updateUser,
};

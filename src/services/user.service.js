const { recoverSignatureAddress } = require("../utils/ethers.util");

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

async function signupUser({ id, username, name, twitter }) {
  // TODO
}

async function updateUser({ id, username, name, twitter }) {
  // TODO
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

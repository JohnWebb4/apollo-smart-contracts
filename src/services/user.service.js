const { recoverSignatureAddress } = require("../utils/web3.util");

function getUser(signature, url) {
  const address = recoverSignatureAddress({ signature, url });

  if (address) {
    return { address };
  }

  return undefined;
}

function getId(chainId, address) {
  return `${chainId}:${address}`;
}

module.exports = { getId, getUser };

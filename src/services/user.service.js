const { recoverSignatureAddress } = require("../utils/web3.util");

function getUser(signature, url) {
  const address = recoverSignatureAddress({ signature, url });

  if (address) {
    return { address };
  }

  return undefined;
}

module.exports = { getUser };

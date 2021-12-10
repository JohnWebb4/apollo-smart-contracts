const ethers = require("ethers");

const message = process.env.AUTH_NONCE;
let provider;
let signer;

function initClient({ url }) {
  provider = new ethers.providers.JsonRpcProvider({ url });
  signer = provider.getSigner();
}

function guardProvider(fnName) {
  if (!provider || !signer) {
    throw new Error(`${fnName} - Must initialize web3`);
  }
}

function recoverSignatureAddress({ signature }) {
  guardProvider("recoverSignatureAddress");

  const address = ethers.utils.verifyMessage(message, signature);

  return address;
}

module.exports = { initClient, recoverSignatureAddress };

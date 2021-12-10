const Web3 = require("web3");

const message = process.env.AUTH_NONCE;
let web3;

function initWeb3Client({ url }) {
  web3 = new Web3(url);
}

function guardWeb3(fnName) {
  if (!web3) {
    throw new Error(`${fnName} - Must initialize web3`);
  }
}

function recoverSignatureAddress({ signature }) {
  guardWeb3("recoverSignatureAddress");

  const hashMessage = web3.eth.accounts.hashMessage(message);
  const eipString = getEIPString(hashMessage);

  const address = web3.eth.accounts.recover(eipString, signature);

  return address;
}

function getEIPString(message) {
  return "\x19Ethereum Signed Message:\n" + message.length + message;
}

module.exports = { initWeb3Client, recoverSignatureAddress };

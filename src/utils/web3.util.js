const Web3 = require("web3");

const message = process.env.AUTH_NONCE;

function getClient({ url }) {
  const web3 = new Web3(url);

  return web3;
}

function recoverSignatureAddress({ signature, url }) {
  const web3 = getClient({ url });

  const hashMessage = web3.eth.accounts.hashMessage(message);
  const eipString = getEIPString(hashMessage);

  const address = web3.eth.accounts.recover(eipString, signature);

  return address;
}

function getEIPString(message) {
  return "\x19Ethereum Signed Message:\n" + message.length + message;
}

module.exports = { recoverSignatureAddress };

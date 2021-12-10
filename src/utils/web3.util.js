const Web3 = require("web3");

function getClient({ url }) {
  const web3 = new Web3(url);

  return web3;
}

function recoverSignatureAddress({ signature, url }) {
  const web3 = getClient({ url });

  const nonce = process.env.AUTH_NONCE;

  const address = web3.eth.accounts.recover(nonce, signature);

  return address;
}

module.exports = { recoverSignatureAddress };

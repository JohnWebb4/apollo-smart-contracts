const ethers = require("ethers");

const message = process.env.AUTH_NONCE;
const privateKey = process.env.PRIVATE_KEY;
const projectId = process.env.INFURA_PROJECT;
const projectSecret = process.env.INFURA_SECRET;

let provider;
let signer;

async function initClient({ name }) {
  provider = new ethers.providers.InfuraProvider(name, {
    projectId,
    projectSecret,
  });

  signer = new ethers.Wallet(privateKey, provider);
}

function guardProvider(fnName) {
  if (!provider || !signer) {
    throw new Error(`${fnName} - Must initialize web3`);
  }
}

function recoverSignatureAddress({ signature }) {
  return ethers.utils.verifyMessage(message, signature);
}

function getContract(cAddress, cAbi, options = {}) {
  guardProvider("getContract");

  let providerOrSigner = provider;

  if (options.signed) {
    providerOrSigner = signer;
  }

  return new ethers.Contract(cAddress, cAbi, providerOrSigner);
}

module.exports = {
  getContract,
  initClient,
  recoverSignatureAddress,
};

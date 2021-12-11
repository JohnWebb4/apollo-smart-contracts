const ethers = require("ethers");

const message = process.env.AUTH_NONCE;
const privateKey = process.env.PRIVATE_KEY;
const projectId = process.env.INFURA_PROJECT;
const projectSecret = process.env.INFURA_SECRET;

let provider;
let signer;

/**
 * Initialize the etherium client
 * @param {{ name: string }} config initialization options for provider
 */
async function initClient(config) {
  provider = new ethers.providers.InfuraProvider(config.name, {
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

/**
 * Get the signer's address
 * @param {string} signature EIP-191 signature
 * @returns {string} address of signer
 */
function recoverSignatureAddress(signature) {
  return ethers.utils.verifyMessage(message, signature);
}

/**
 * Get a contract
 * @param {string} cAddress contract's address
 * @param {JSON} cAbi contract abi
 * @param {{ signed }} options contract fetch options
 * @returns {Contract} contract
 */
function getContract(cAddress, cAbi, options = {}) {
  guardProvider("getContract");

  let providerOrSigner = provider;

  if (options.signed) {
    providerOrSigner = signer;
  }

  return new ethers.Contract(cAddress, cAbi, providerOrSigner);
}

/**
 * Deploy a new contract.
 * @param {JSON} cAbi contract ABI
 * @param {JSON} cBin contract bytecode
 * @param {JSON} args contract constructor arguments
 * @returns {Promise<Contract>} Promise for deployed contract
 */
function createContract(cAbi, cBin, args = []) {
  guardProvider("getContract");

  const factory = ethers.ContractFactory(cAbi, cBin, signer);

  return factory.deploy(...args);
}

module.exports = {
  createContract,
  getContract,
  initClient,
  recoverSignatureAddress,
};

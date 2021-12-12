const ethers = require("ethers");

const message = process.env.AUTH_NONCE;
const privateKey = process.env.PRIVATE_KEY;
const projectId = process.env.INFURA_PROJECT;
const projectSecret = process.env.INFURA_SECRET;

/**
 * @type {{[name: number]: {provider: Provider, signer: Signer}}} map of open providers and signers
 */
const clients = {};

/**
 * Initialize the etherium client
 * @param {string} chainName name of the chain
 */
function initClient(chainName) {
  provider = new ethers.providers.InfuraProvider(chainName, {
    projectId,
    projectSecret,
  });

  signer = new ethers.Wallet(privateKey, provider);

  clients[chainName] = { provider, signer };
}

/**
 * Initialize client if no instance is running
 * @param {string} chainName Name of chain
 * @param {string?} fnName Optional name of calling function
 */
function initClientIfMissing(chainName, fnName) {
  if (!clients[chainName]) {
    console.info(`${fnName} - Initializing client ${chainName}`);
    initClient(chainName);
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
 * @param {string} chainName name of the chain
 * @param {string} cAddress contract's address
 * @param {JSON} cAbi contract abi
 * @param {{ signed: boolean? }} options contract fetch options
 * @returns {Contract} contract
 */
function getContract(chainName, cAddress, cAbi, options = {}) {
  initClientIfMissing(chainName, "getContract");

  const { provider, signer } = clients[chainName];

  let providerOrSigner = provider;

  if (options.signed) {
    providerOrSigner = signer;
  }

  return new ethers.Contract(cAddress, cAbi, providerOrSigner);
}

/**
 * Get the most recent block number
 * @param {*} chainName
 * @returns
 */
function getBlockNumber(chainName) {
  initClientIfMissing(chainName, "getBlockNumber");

  const { provider } = clients[chainName];

  return provider.getBlockNumber();
}

/**
 * Check if string value matches ether indexed hash
 * @param {string} value
 * @param {string} indexedHash
 * @returns {boolean} if matches
 */
function doesValueEqualIndexedHash(value, indexedHash) {
  let valueBytes = ethers.utils.toUtf8Bytes(value);
  let hashValue = ethers.utils.keccak256(valueBytes);

  return hashValue === indexedHash;
}

module.exports = {
  doesValueEqualIndexedHash,
  getBlockNumber,
  getContract,
  initClient,
  recoverSignatureAddress,
};

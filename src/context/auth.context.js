const { AuthenticationError } = require("apollo-server-errors");

const { getChain } = require("../resources/chain.resource");
const { recoverSignatureAddress } = require("../utils/ethers.util");
const { initClient } = require("../utils/ethers.util");

async function getAuthContext({ req, res }) {
  const chainId = req.headers["chain-id"];
  const authSignature = req.headers["auth-signature"];

  if (!chainId) {
    throw new AuthenticationError("Missing Chain ID");
  }

  if (!authSignature) {
    throw new AuthenticationError("Missing Auth Signature");
  }

  const chain = getChain(chainId);

  if (!chain) {
    throw new AuthenticationError("Invalid Chain ID");
  }

  const address = recoverSignatureAddress(authSignature, chain.url);

  if (!address) {
    throw new AuthenticationError("Invalid Account");
  }

  initClient(chain.name);

  return { chain, user: { address } };
}

module.exports = { getAuthContext };

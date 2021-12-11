const { AuthenticationError } = require("apollo-server-errors");

const { getChain } = require("../services/chain.service");
const { recoverSignatureAddress } = require("../utils/ethers.util");
const { initClient } = require("../utils/ethers.util");
const { initDB } = require("../utils/mongo.util");

async function getAuthContext({ req, res }) {
  const chainId = req.headers["chain-id"];
  const authSignature = req.headers["auth-signature"];

  if (!chainId) {
    throw new AuthenticationError("Missing chain ID");
  }

  if (!authSignature) {
    throw new AuthenticationError("Missing Auth Signature");
  }

  const chain = getChain(chainId);

  if (!chain) {
    throw new AuthenticationError("Invalid Chain id");
  }

  const address = recoverSignatureAddress(authSignature, chain.url);

  if (!address) {
    throw new AuthenticationError("Invalid Account");
  }

  await initClient({ name: chain.name });

  await initDB();

  return { chain, user: { address } };
}

module.exports = { getAuthContext };

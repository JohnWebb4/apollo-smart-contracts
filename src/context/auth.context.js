const { AuthenticationError } = require("apollo-server-errors");

const { getChain } = require("../services/chain.service");
const { getSignatureUser } = require("../services/user.service");
const { initClient } = require("../utils/ethers.util");

function getAuthContext({ req, res }) {
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

  initClient({ url: chain.url });

  const user = getSignatureUser(authSignature, chain.url);

  if (!user) {
    throw new AuthenticationError("Invalid Account");
  }

  return { chain, user };
}

module.exports = { getAuthContext };

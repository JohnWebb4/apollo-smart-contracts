const { AuthenticationError } = require("apollo-server-errors");

const { getChain } = require("../services/chain.service");
const { getUser } = require("../services/user.service");

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

  const user = getUser(authSignature);

  if (!chain) {
    throw new AuthenticationError("Invalid Chain id");
  }

  if (!user) {
    throw new AuthenticationError("Invalid Account");
  }

  return { chain, user };
}

module.exports = { getAuthContext };

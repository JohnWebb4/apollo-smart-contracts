/**
 * Get a unique id for the user on the current chain
 * @param {string} chainId id of the chain
 * @param {string} address address of the user
 * @returns {string} unique id
 */
function getId(chainId, address) {
  return `${chainId}:${address}`;
}

module.exports = { getId };

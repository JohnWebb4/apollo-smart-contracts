const chainMap = {
  4: {
    id: 4,
    name: "rinkeby",
  },
  42: {
    id: 42,
    name: "kovan",
  },
};

/**
 * Get chain config from id
 * @param {*} chainId id of chain
 * @returns {{ id: number, name: string }} chain config
 */
function getChain(chainId) {
  return chainMap[chainId];
}

module.exports = { getChain };

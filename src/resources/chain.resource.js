const chainMap = {
  4: {
    id: 4,
    name: "rinkeby",
    identityAddress: "0x77C21B074442b55b0F720D59bb68698aAFEC60e3",
  },
  42: {
    id: 42,
    name: "kovan",
    identityAddress: "0xA914dDfa731A47Afb2704Af36b737Fefc4464CcA",
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

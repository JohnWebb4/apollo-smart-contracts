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

function getChain(chainId) {
  return chainMap[chainId];
}

module.exports = { getChain };

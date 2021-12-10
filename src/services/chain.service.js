const chainMap = {
  4: {
    id: 4,
    name: "rinkeby",
    url: process.env.RINKEBY_URL,
  },
  42: {
    id: 42,
    name: "kovan",
    url: process.env.KOVAN_URL,
  },
};

function getChain(chainId) {
  return chainMap[chainId];
}

module.exports = { getChain };

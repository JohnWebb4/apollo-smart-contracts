const Queue = require("bull");
const { getChain } = require("../resources/chain.resource");

const {
  processIndexContractEvent,
} = require("../workers/indexContractEvent.worker");

const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;
const port = process.env.REDIS_PORT;
const chainIds = [4, 42];

const indexContractEventQueue = new Queue("contract-events", {
  redis: { host, password, port },
});

/**
 * Adds an event to index the current contract
 * @param {*} event
 */
async function initContractWorker() {
  for (chainId of chainIds) {
    const chain = getChain(chainId);

    await indexContractEventQueue.add({ chain });
  }
}

indexContractEventQueue.process(processIndexContractEvent);

process.on("SIGINT", async function () {
  // Cleanup workers on exit
  console.info("Starting queue shutdown");

  await indexContractEventQueue.close();
  console.info("Finished index contract queue shutdown");

  process.exit(0);
});

module.exports = { initContractWorker };

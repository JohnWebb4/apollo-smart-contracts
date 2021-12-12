const Queue = require("bull");
const { getChain } = require("../resources/chain.resource");

const { processContractJob } = require("../workers/contractJob.worker");
const {
  processIndexContractEvent,
} = require("../workers/indexContractEvent.worker");

const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;
const port = process.env.REDIS_PORT;
const chainIds = [4, 42];

const addContractJobQueue = new Queue("contract-jobs", {
  redis: { host, password, port },
});

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

/**
 * Add a job to perform on the current contract
 * @param {*} event
 */
async function addContractJob(event) {
  await addContractJobQueue.add(event);
}

addContractJobQueue.process(processContractJob);
indexContractEventQueue.process(processIndexContractEvent);

process.on("SIGINT", async function () {
  // Cleanup workers on exit
  console.info("Starting queue shutdown");

  await addContractJobQueue.close();
  console.info("Finished add contract job queue shutdown");

  await indexContractEventQueue.close();
  console.info("Finished index contract queue shutdown");

  process.exit(0);
});

module.exports = { addContractJob, initContractWorker };

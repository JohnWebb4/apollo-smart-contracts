const Queue = require("bull");

const {
  processIndexContractEvent,
} = require("../workers/indexContractEvent.worker");

const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;
const port = "19196"; // Could move to env file. Not gonna worry about now.

const indexContractEventQueue = new Queue("contract-events", {
  redis: { host, password, port },
});

/**
 * Adds an event to index the current contract
 * @param {*} event
 */
async function addIndexContractEvent(event) {
  await indexContractEventQueue.add(event);
}

indexContractEventQueue.process(processIndexContractEvent);

process.on("SIGINT", async function () {
  // Cleanup workers on exit
  console.info("Starting queue shutdown");

  await indexContractEventQueue.close();
  console.info("Finished index contract queue shutdown");

  process.exit(0);
});

module.exports = { addIndexContractEvent };

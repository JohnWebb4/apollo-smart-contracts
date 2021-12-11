const Queue = require("bull");

const { processContractEvent } = require("../workers/contractevent.worker");

const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;
const port = "19196"; // Could move to env file. Not gonna worry about now.

const contractEventQueue = new Queue("contract-events", {
  redis: { host, password, port },
});

async function addContractEvent(event) {
  await contractEventQueue.add(event);
}

contractEventQueue.process(processContractEvent);

process.on("SIGINT", function () {
  // Cleanup workers
  console.log("Starting queue shutdown");
  contractEventQueue.close().then(function () {
    console.log("Finished queue shutdown");
    process.exit(0);
  });
});

module.exports = { addContractEvent };

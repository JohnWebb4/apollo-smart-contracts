const ethers = require("ethers");

const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const { getId } = require("../resources/user.resource");
const { getContract, getBlockNumber } = require("../utils/ethers.util");
const { writeDocument } = require("../utils/mongo.util");
const { getKey, getCache, setCache } = require("../utils/redis.util");

const collection = "ContractEvents";

/**
 * @type {{[id: string]: boolean}} Map of currently indexed chains
 */
const indexedChainsMutex = {};

/**
 * Process Index contract events
 * @param {*} job
 * @param {*} done
 */
async function processIndexContractEvent(job, done) {
  const { chain } = job.data;

  if (indexedChainsMutex[chain.id]) {
    // Chain is indexed and subscribed
    done();
    return;
  }

  // Lock
  indexedChainsMutex[chain.id] = true;

  await subscribeNewEvents({ chain });

  await indexPastEvents({ chain });

  done();
}

/**
 * Index past events from chain
 * @param {{ chain }} options chain to index
 */
async function indexPastEvents({ chain }) {
  const identityManagerContract = getContract(
    chain.name,
    ethers.utils.getAddress(chain.identityAddress),
    IdentityManagerContractABI,
    {
      signed: true,
    }
  );

  const eventFilter = [
    identityManagerContract.filters.CreateIdentity,
    identityManagerContract.filters.UpdateIdentity,
    identityManagerContract.filters.DeleteIdentity,
  ];

  let nextBlockToRead = (await getLastBlockReadCache(chain)) + 1;

  const blockNumber = await getBlockNumber(chain.name);

  const diff = nextBlockToRead - blockNumber;

  if (diff < 0) {
    const events = await identityManagerContract.queryFilter(eventFilter, diff);

    events.forEach((event) => {
      processEvent(chain, event);
    });
  } else {
    console.info("No new events to index", chain.id, blockNumber);
  }

  console.info("Indexed past events", chain.id, blockNumber);
}

/**
 * Subscribe to new events on chain
 * @param {{ chain }} options chain to listen to
 */
function subscribeNewEvents({ chain }) {
  const identityManagerContract = getContract(
    chain.name,
    ethers.utils.getAddress(chain.identityAddress),
    IdentityManagerContractABI,
    {
      signed: true,
    }
  );

  const eventFilter = [
    identityManagerContract.filters.CreateIdentity,
    identityManagerContract.filters.UpdateIdentity,
    identityManagerContract.filters.DeleteIdentity,
  ];

  const boundProcessEvent = processEvent.bind(undefined, chain);

  identityManagerContract.on(eventFilter, boundProcessEvent);

  console.info("Subscribed for new events", chain.id);
}

/**
 * Process identity manager event
 * @param {Chain} chain current chain
 * @param {Event} event blockchain event
 */
async function processEvent(chain, event) {
  const { args, blockNumber, event: eventName } = event;
  let user = {};

  console.info("Procesing contract event", eventName, blockNumber);

  switch (eventName) {
    case "CreateIdentity":
      const [addr, username, name, twitter] = args;
      const id = getId(chain.id, addr);

      user = {
        id,
        addr,
        username,
        name,
        twitter,
      };
  }

  await writeDocument(collection, {
    _id: blockNumber,
    blockNumber,
    eventName,
    ...user,
  });

  // Update last read
  await updateLastBlockReadCache(chain, blockNumber);
}

/**
 * Reads the last block number that was cached
 * @param {Chain} chain current chain
 * @returns {number} last block number
 */
async function getLastBlockReadCache(chain) {
  const key = getKey(["lastBlockRead", chain.name]);
  let lastBlockRead = await getCache(key);

  if (!lastBlockRead || isNaN(lastBlockRead)) {
    lastBlockRead = 0;
  }

  return lastBlockRead;
}

/**
 * Update last block on cache
 * @param {Chain} chain current chain
 * @param {number} blockNumber the new block number
 */
async function updateLastBlockReadCache(chain, blockNumber) {
  const lastBlockRead = await getLastBlockReadCache(chain);

  await setCache(key, Math.max(lastBlockRead, blockNumber));
}

module.exports = { processIndexContractEvent };

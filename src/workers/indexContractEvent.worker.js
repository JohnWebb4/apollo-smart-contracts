const ethers = require("ethers");

const {
  CONTRACT_EVENTS,
  CONTRACT_EVENT_COLLECTION_NAME,
} = require("../constants/contractEvent.constant");
const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const { getId } = require("../resources/user.resource");
const { getContract, getBlockNumber } = require("../utils/ethers.util");
const { writeDocument } = require("../utils/mongo.util");
const { getKey, getCache, setCache } = require("../utils/redis.util");

const lastBlockReadKey = "lastBlockRead";

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

  try {
    await subscribeNewEvents({ chain });

    await indexPastEvents({ chain });
  } catch (error) {
    // Lock
    console.warn("Error indexing worker. Unlocking", chain.id, error);
    indexedChainsMutex[chain.id] = false;

    throw error;
  }

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

  let nextBlockToRead = 0; // (await getLastBlockReadCache(chain)) + 1;

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
  const { blockNumber, event: eventName } = event;
  let user = {};

  console.info("Procesing contract event", eventName, blockNumber);

  switch (eventName) {
    case CONTRACT_EVENTS.CreateIdentity:
      user = getUserFromCreateEvent(chain, event);
      break;
    case CONTRACT_EVENTS.UpdateIdentity:
      user = getUserFromUpdateEvent(chain, event);
      break;
    case CONTRACT_EVENTS.DeleteIdentity:
      user = getUserFromDeleteEvent(chain, event);
      break;
    case CONTRACT_EVENTS.OwnershipTransferred:
      user = getUserFromOwnershipTransferredEvent(chain, event);
      break;
    default:
      break;
  }

  await writeDocument(CONTRACT_EVENT_COLLECTION_NAME, {
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
  const key = getKey([lastBlockReadKey, chain.name]);
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
  const key = getKey([lastBlockReadKey, chain.name]);
  const lastBlockRead = await getLastBlockReadCache(chain);

  await setCache(key, Math.max(lastBlockRead, blockNumber));
}

function getUserFromCreateEvent(chain, event) {
  let [addr, indexUsername, name, twitter] = event.args;
  const id = getId(chain.id, addr);
  const username = indexUsername.hash;

  return {
    id,
    username,
    name,
    twitter,
  };
}

function getUserFromUpdateEvent(chain, event) {
  let [addr, indexUsername, name, twitter] = event.args;
  const id = getId(chain.id, addr);
  const username = indexUsername.hash;

  return {
    id,
    username,
    name,
    twitter,
  };
}

function getUserFromDeleteEvent(chain, event) {
  let [addr, indexUsername] = event.args;
  const id = getId(chain.id, addr);
  const username = indexUsername.hash;

  return {
    id,
    username,
  };
}

function getUserFromOwnershipTransferredEvent(chain, event) {
  const [fromAddr, toAddr] = event.args;
  const id = getId(chain.id, fromAddr);

  return {
    id,
    to: toAddr,
  };
}

module.exports = { processIndexContractEvent };

const ethers = require("ethers");

const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const {
  CONTRACT_EVENT_COLLECTION_NAME,
  CONTRACT_EVENTS,
} = require("../constants/contractEvent.constant");
const { CONTRACT_JOBS } = require("../constants/contractJob.constant");
const { getChain } = require("../resources/chain.resource");
const { getContract } = require("../utils/ethers.util");
const { deleteOne, queryCollection } = require("../utils/mongo.util");

const gasLimit = ethers.utils.parseUnits("0.00000000003"); // Estimates

/**
 * Message queue worker. Process all events on blockchain
 * @param {*} job
 * @param {(percent?: number) => void} done
 */
async function processContractJob(job, done) {
  const { id, jobName, username, name, twitter } = job.data;

  try {
    switch (jobName) {
      case CONTRACT_JOBS.signupUser:
        await processSignupJob({ id, username, name, twitter });
        break;
      case CONTRACT_JOBS.updateUser:
        await processUpdateUserJob({ id, username, name, twitter });
        break;
      default:
        console.info("Unknown job", jobName, id);
        break;
    }

    console.info("Processed job", id, jobName);

    done();
  } catch (error) {
    await dropPendingEvent({ id, jobName });

    console.warn("Error processing job", error);
  }
}

async function processSignupJob({ id, username, name, twitter }) {
  const [chainId, address] = id.split(":");
  const chain = getChain(chainId);

  const identityManagerContract = getContract(
    chain.name,
    ethers.utils.getAddress(chain.identityAddress),
    IdentityManagerContractABI,
    {
      signed: true,
    }
  );

  await (
    await identityManagerContract.createIdentity(
      ethers.utils.getAddress(address),
      username,
      name,
      twitter,
      {
        gasLimit,
      }
    )
  ).wait();
}

async function processUpdateUserJob({ id, username, name, twitter }) {
  const [chainId, address] = id.split(":");
  const chain = getChain(chainId);

  const identityManagerContract = getContract(
    chain.name,
    ethers.utils.getAddress(chain.identityAddress),
    IdentityManagerContractABI,
    {
      signed: true,
    }
  );

  await (
    await identityManagerContract.updateIdentity(
      ethers.utils.getAddress(address),
      username,
      name,
      twitter,
      {
        gasLimit,
      }
    )
  ).wait();
}

async function dropPendingEvent({ id, jobName }) {
  try {
    const eventName = getPendingEventFromJob(jobName);

    if (eventName) {
      const cursor = queryCollection(CONTRACT_EVENT_COLLECTION_NAME, {
        id,
        eventName,
      });

      if (await cursor.hasNext()) {
        const contractEvent = await cursor.next();

        await deleteOne(CONTRACT_EVENT_COLLECTION_NAME, contractEvent._id);

        console.info("Dropped failed pending event", id, eventName);
      }
    }
  } catch (error) {
    console.warn(error);
  }
}

function getPendingEventFromJob(jobName) {
  switch (jobName) {
    case CONTRACT_JOBS.signupUser:
      return CONTRACT_EVENTS.pendingCreateIdentity;
    case CONTRACT_JOBS.updateUser:
      return CONTRACT_EVENTS.updateIdentity;
    default:
      return undefined;
  }
}

module.exports = { processContractJob };

const ethers = require("ethers");

const IdentityManagerContractABI = require("../../contracts/artifacts/IdentityManager.abi.json");
const { CONTRACT_JOBS } = require("../constants/contractJob.constant");
const { getChain } = require("../resources/chain.resource");
const { getContract } = require("../utils/ethers.util");

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

    done();
  } catch (error) {
    console.warn("Error processing job", error);
  }
}

async function processSignupJob({ id, username, name, twitter }) {
  const chainId = id.split(":")[0];
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
  const chainId = id.split(":")[0];
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

module.exports = { processContractJob };

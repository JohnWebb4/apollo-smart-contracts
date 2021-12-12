const { queryCollection } = require("../utils/mongo.util");
const {
  CONTRACT_EVENTS,
  CONTRACT_EVENT_COLLECTION_NAME,
} = require("../constants/contractEvent.constant");

async function getUserFromEvents(id) {
  if (!id || typeof id !== "string") {
    throw new Error("getUserFromEvents - Need id");
  }

  let eventCursor = await queryCollection(
    CONTRACT_EVENT_COLLECTION_NAME,
    {
      id,
    },
    {
      blockNumber: 1,
    }
  );

  if (!(await eventCursor.hasNext)) {
    return null;
  }

  let user;

  while (await eventCursor.hasNext()) {
    const contractEvent = await eventCursor.next();

    const [chainId] = contractEvent.id.split(":");

    switch (contractEvent.eventName) {
      case CONTRACT_EVENTS.createIdentity:
        if (!user) {
          user = {};
        }

        user.id = contractEvent.id;
        user.chainId = chainId;
        user.address = contractEvent.address;
        user.name = contractEvent.name;
        user.twitter = contractEvent.twitter;
        break;
      case CONTRACT_EVENTS.pendingCreateIdentity:
        if (!user) {
          user = {};
        }

        user.id = contractEvent.id;
        user.chainId = chainId;
        user.address = "pending";
        user.name = contractEvent.name;
        user.twitter = contractEvent.twitter;
      case CONTRACT_EVENTS.updateIdentity:
        user.username = contractEvent.username;
        user.address = contractEvent.address;
        user.name = contractEvent.name;
        user.twitter = contractEvent.twitter;
        break;
      case CONTRACT_EVENTS.pendingUpdateIdentity:
        user.username = contractEvent.username;
        user.address = "pending";
        user.name = contractEvent.name;
        user.twitter = contractEvent.twitter;
        break;
      case CONTRACT_EVENTS.deleteIdentity:
        user = null;
        break;
      case CONTRACT_EVENTS.ownershipTransferred:
        user = null;
        break;
      default:
        break;
    }
  }

  return user;
}

module.exports = { getUserFromEvents };

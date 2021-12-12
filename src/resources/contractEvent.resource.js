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

    const [chainId, address] = contractEvent.id.split(":");

    switch (contractEvent.eventName) {
      case CONTRACT_EVENTS.CreateIdentity:
        user = {
          id: contractEvent.id,
          chainId,
          address,
          username: contractEvent.username,
          name: contractEvent.name,
          twitter: contractEvent.twitter,
        };
        break;
      case CONTRACT_EVENTS.UpdateIdentity:
        user.username = contractEvent.username;
        user.name = contractEvent.name;
        user.twitter = contractEvent.twitter;
        break;
      case CONTRACT_EVENTS.DeleteIdentity:
        user = null;
        break;
      case CONTRACT_EVENTS.OwnershipTransferred:
        user = null;
        break;
      default:
        break;
    }
  }

  return user;
}

module.exports = { getUserFromEvents };

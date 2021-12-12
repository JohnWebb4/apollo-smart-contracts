const { queryCollection } = require("../utils/mongo.util");
const {
  CONTRACT_EVENTS,
  CONTRACT_EVENT_COLLECTION_NAME,
} = require("../constants/contractEvent.constant");

async function getUserFromEvents(id) {
  if (!id || typeof id !== "string") {
    throw new Error("getUserFromEvents - Need id");
  }

  let eventCursor = await queryCollection(CONTRACT_EVENT_COLLECTION_NAME, {
    id,
  });

  if (!(await eventCursor.hasNext)) {
    return null;
  }

  let user;

  while (await eventCursor.hasNext()) {
    const contractEvent = await eventCursor.next();

    switch (contractEvent.eventName) {
      case CONTRACT_EVENTS.CreateIdentity:
        user = {
          id: contractEvent.id,
          chainId: contractEvent.chainId,
        };
      default:
        break;
    }
  }

  return user;
}

module.exports = { getUserFromEvents };

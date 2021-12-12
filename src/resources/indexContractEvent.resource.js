const { queryCollection } = require("../utils/mongo.util");

const collection = "ContractEvents";

async function getUserFromEvents(id) {
  const contractEvents = await queryCollection(collection, { id });
  let user = undefined;

  // TODO: Build user from events

  return user;
}

module.exports = { getUserFromEvents };

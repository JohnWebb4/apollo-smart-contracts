const CONTRACT_EVENT_COLLECTION_NAME = "ContractEvents";

const CONTRACT_EVENTS = {
  createIdentity: "CreateIdentity",
  pendingCreateIdentity: "PendingCreateIdentity",
  deleteIdentity: "DeleteIdentity",
  ownershipTransferred: "OwnershipTransferred",
  updateIdentity: "UpdateIdentity",
  pendingUpdateIdentity: "PendingUpdateIdentity",
};

module.exports = { CONTRACT_EVENTS, CONTRACT_EVENT_COLLECTION_NAME };

const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URL;
const dbName = "ApolloContracts";

const client = new MongoClient(url, {
  sslKey: "./db-certificate.pem",
  sslCert: "./db-certificate.pem",
});
let db;

/**
 * Initialize the database
 */
async function initDB() {
  try {
    await client.connect();
    db = client.db(dbName);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Query collection
 * @param {*} collectionName name of collection
 * @param {{}} query object with params to query
 * @returns {Cursor} mongo cursor for iteration
 */
function queryCollection(collectionName, query) {
  return db.collection(collectionName).find(query);
}

/**
 * Write a document to the collection
 * @param {*} collectionName name of the collection
 * @param {*} document document to write
 * @returns {Promise<InsertOneModel>} returns promise of inserted document
 */
function writeDocument(collectionName, document) {
  return db.collection(collectionName).insertOne(document);
}

module.exports = { initDB, queryCollection, writeDocument };

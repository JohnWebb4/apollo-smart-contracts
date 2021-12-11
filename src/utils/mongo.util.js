const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URL;
const dbName = "ApolloContracts";

const client = new MongoClient(url, {
  sslKey: "./db-certificate.pem",
  sslCert: "./db-certificate.pem",
});
let db;

async function initDB() {
  try {
    await client.connect();
    db = client.db(dbName);
  } catch (err) {
    console.error(err);
  }
}
async function writeDocument(collectionName, document) {
  await db.collection(collectionName).insertOne(document);
}

module.exports = { initDB, writeDocument };

const Redis = require("ioredis");

const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;
const port = process.env.REDIS_PORT;

const redis = new Redis({
  password,
  port,
  host,
});

/**
 * Generate unique key from array of ids
 * @param {[string]} ids array of ids to generate key from
 * @returns {string} unique cache key
 */
function getKey(ids = []) {
  return ids.join(":");
}

/**
 * Get value from cache
 * @param {string} key cache key
 * @returns {Promise<string>}
 */
function getCache(key) {
  return redis.get(key);
}

/**
 * Set Redis cache at key
 * @param {string} key cache key
 * @param {string} value cache value
 * @returns {Promise<string>} resolves to "OK" if successful
 */
function setCache(key, value) {
  return redis.set(key, value);
}

module.exports = { getCache, getKey, setCache };

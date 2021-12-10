class RequestError extends Error {
  statusCode;

  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = { RequestError };

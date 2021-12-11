class RequestError extends Error {
  statusCode;

  constructor(message, statusCode) {
    super();

    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = { RequestError };

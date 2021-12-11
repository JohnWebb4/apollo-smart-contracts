class RequestError extends Error {
  statusCode;

  /**
   * Construct a request error
   * @param {*} message Error message
   * @param {*} statusCode  Status code to return
   */
  constructor(message, statusCode) {
    super();

    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = { RequestError };

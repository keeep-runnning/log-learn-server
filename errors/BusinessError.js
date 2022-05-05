class BusinessError extends Error {
  constructor({ message, statusCode, errorCode, errors = [] }) {
    super(message);
    this.name = "BusinessError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

module.exports = { BusinessError };

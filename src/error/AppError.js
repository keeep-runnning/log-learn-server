export default class AppError extends Error {
  constructor({ message, statusCode, errors = [] }) {
    super(message);
    this.name = AppError.name;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

import AppError from "../AppError.js";

export default class BadRequestError extends AppError {
  constructor({
    message = "올바르지 않은 요청입니다",
    statusCode = 400,
    errors = [],
  } = {}) {
    super({ message, statusCode, errors });
    this.name = BadRequestError.name;
  }
}

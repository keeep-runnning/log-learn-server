import AppError from "../AppError.js";

export default class NotFoundError extends AppError {
  constructor({ message = "존재하지 않는 경로입니다", statusCode = 404 } = {}) {
    super({ message, statusCode });
    this.name = NotFoundError.name;
  }
}

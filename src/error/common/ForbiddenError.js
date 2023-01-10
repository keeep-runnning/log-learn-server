import AppError from "../AppError.js";

export default class ForbiddenError extends AppError {
  constructor({ message = "권한이 없습니다", statusCode = 403 } = {}) {
    super({ message, statusCode });
    this.name = ForbiddenError.name;
  }
}

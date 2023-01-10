import AppError from "../AppError.js";

export default class UnauthorizedError extends AppError {
  constructor({ message = "로그인이 필요합니다", statusCode = 401 } = {}) {
    super({ message, statusCode });
    this.name = UnauthorizedError.name;
  }
}

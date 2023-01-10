import AppError from "../AppError.js";

export default class UserNotFoundError extends AppError {
  constructor({ message = "존재하지 않는 유저입니다", statusCode = 404 } = {}) {
    super({ message, statusCode });
    this.name = UserNotFoundError.name;
  }
}

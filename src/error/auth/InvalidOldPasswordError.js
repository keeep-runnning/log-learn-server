import AppError from "../AppError.js";

export default class InvalidOldPasswordError extends AppError {
  constructor({ message = "기존 비밀번호가 올바르지 않습니다", statusCode = 409 } = {}) {
    super({ message, statusCode });
    this.name = InvalidOldPasswordError.name;
  }
}

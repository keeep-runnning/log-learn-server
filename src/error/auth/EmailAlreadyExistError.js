import AppError from "../AppError.js";

export default class EmailAlreadyExistError extends AppError {
  constructor({ message = "이미 사용중인 이메일입니다", statusCode = 409 } = {}) {
    super({ message, statusCode });
    this.name = EmailAlreadyExistError.name;
  }
}

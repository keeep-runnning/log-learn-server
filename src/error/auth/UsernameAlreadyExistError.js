import AppError from "../AppError.js";

export default class UsernameAlreadyExistError extends AppError {
  constructor({
    message = "이미 사용중인 유저이름입니다",
    statusCode = 409,
  } = {}) {
    super({ message, statusCode });
    this.name = UsernameAlreadyExistError.name;
  }
}

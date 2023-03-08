import AppError from "../AppError.js";

export default class InvalidCredentialsError extends AppError {
  constructor({
    message = "이메일 혹은 비밀번호가 유효하지 않습니다",
    statusCode = 401,
  } = {}) {
    super({ message, statusCode });
    this.name = InvalidCredentialsError.name;
  }
}

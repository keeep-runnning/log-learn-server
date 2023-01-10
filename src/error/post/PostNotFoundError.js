import AppError from "../AppError.js";

export default class PostNotFoundError extends AppError {
  constructor({ message = "블로그 포스트가 없습니다", statusCode = 404 } = {}) {
    super({ message, statusCode });
    this.name = PostNotFoundError.name;
  }
}

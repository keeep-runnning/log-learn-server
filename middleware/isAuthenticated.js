import BusinessError from "../errors/BusinessError.js";

export default function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    throw new BusinessError({
      errorCode: "common-002",
      message: "로그인이 필요합니다.",
      statusCode: 401,
    });
  }
  next();
}

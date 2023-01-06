// import AppError from "../error/AppError.js";

export default function isAuthenticated(req, res, next) {
  // if (!req.isAuthenticated()) {
  //   throw new AppError({
  //     message: "로그인이 필요합니다",
  //     statusCode: 401,
  //   });
  // }
  next();
}

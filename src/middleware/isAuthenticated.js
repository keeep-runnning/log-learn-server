import jwt from "jsonwebtoken";

import config from "../config.js";
import AppError from "../error/AppError.js";
import * as userRepository from "../repository/user.js";

export default function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError({
      message: "로그인이 필요합니다",
      statusCode: 401,
    });
  }

  jwt.verify(token, config.jwt.secret, async (error, decoded) => {
    if (error) {
      return next(
        new AppError({
          message: "로그인이 필요합니다",
          statusCode: 401,
        })
      );
    }

    const userId = decoded?.userId;
    const user = await userRepository.findById(userId);
    if (!user) {
      return next(
        new AppError({
          message: "로그인이 필요합니다",
          statusCode: 401,
        })
      );
    }
    req.user = { id: userId };
    next();
  });
}

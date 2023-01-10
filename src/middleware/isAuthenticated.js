import AppError from "../error/AppError.js";
import { verifyToken } from "../lib/jwtToken.js";
import * as userRepository from "../repository/user.js";

const LOG_TAG = `${isAuthenticated.name} middleware:`;

export default async function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log(LOG_TAG, "there is no token in cookie");
    throw new AppError({
      message: "로그인이 필요합니다",
      statusCode: 401,
    });
  }

  let decoded;
  try {
    decoded = await verifyToken(token);
  } catch (error) {
    console.log(LOG_TAG, "token is invalid");
    throw new AppError({
      message: "로그인이 필요합니다",
      statusCode: 401,
    });
  }

  const { userId } = decoded;
  const user = await userRepository.findById(userId);
  if (!user) {
    console.log(LOG_TAG, "token is valid but user does not exist");
    throw new AppError({
      message: "로그인이 필요합니다",
      statusCode: 401,
    });
  }
  req.user = { id: user.id };
  next();
}

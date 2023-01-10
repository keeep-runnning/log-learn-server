import UnauthorizedError from "../error/common/UnauthorizedError.js";
import { verifyToken } from "../lib/jwtToken.js";
import * as userRepository from "../repository/user.js";

const LOG_TAG = `${isAuthenticated.name} middleware:`;

export default async function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log(LOG_TAG, "there is no token in cookie");
    throw new UnauthorizedError();
  }

  let decoded;
  try {
    decoded = await verifyToken(token);
  } catch (error) {
    console.log(LOG_TAG, "token is invalid");
    throw new UnauthorizedError();
  }

  const { userId } = decoded;
  const user = await userRepository.findById(userId);
  if (!user) {
    console.log(LOG_TAG, "token is valid but user does not exist");
    throw new UnauthorizedError();
  }

  req.user = { id: user.id };
  next();
}

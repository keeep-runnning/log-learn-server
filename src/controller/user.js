import UserNotFoundError from "../error/user/UserNotFoundError.js";
import * as userRepository from "../repository/user.js";

export async function getUserByUsername(req, res) {
  const { username } = req.params;

  const user = await userRepository.findByUsername(username);

  if (!user) {
    throw new UserNotFoundError();
  }

  res.json({
    username: user.username,
    shortIntroduction: user.shortIntroduction ?? "",
    introduction: user.introduction ?? "",
  });
}

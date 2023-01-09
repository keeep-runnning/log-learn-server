import AppError from "../error/AppError.js";
import * as userRepository from "../repository/user.js";

export async function getUserByUsername(req, res) {
  const { username } = req.params;

  const user = await userRepository.findByUsername(username);

  if (!user) {
    throw new AppError({
      message: "존재하지 않는 유저입니다",
      statusCode: 404,
    });
  }

  res.json({
    username: user.username,
    shortIntroduction: user.shortIntroduction ?? "",
    introduction: user.introduction ?? "",
  });
}

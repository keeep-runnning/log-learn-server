import AppError from "../error/AppError.js";
import * as userRepository from "../repository/user.js";

export async function getUserByUsername(req, res) {
  const { username } = req.params;

  const userFoundByUsername = await userRepository.findByUsername(username);

  if (!userFoundByUsername) {
    throw new AppError({
      message: "존재하지 않는 유저입니다",
      statusCode: 404,
    });
  }

  res.status(200).json({
    username: userFoundByUsername.username,
    shortIntroduction: userFoundByUsername.shortIntroduction ?? "",
    introduction: userFoundByUsername.introduction ?? "",
  });
}

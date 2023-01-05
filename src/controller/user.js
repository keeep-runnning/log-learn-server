import * as bcrypt from "bcrypt";

import config from "../config.js";
import AppError from "../error/AppError.js";
import * as userRepository from "../repository/user.js";

export async function createUser(req, res) {
  const { username, email, password: rawPassword } = req.body;

  const userFoundByUsername = await userRepository.findByUsername(username);
  if (userFoundByUsername) {
    throw new AppError({
      message: "이미 사용중인 유저이름입니다",
      statusCode: 409,
    });
  }

  const userFoundByEmail = await userRepository.findByEmail(email);
  if (userFoundByEmail) {
    throw new AppError({
      message: "이미 사용중인 이메일입니다",
      statusCode: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(rawPassword, config.bcrypt.saltRounds);
  await userRepository.create({ username, email, password: hashedPassword });

  res.status(200).send();
}

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

import * as bcrypt from "bcrypt";

import config from "../config.js";
import BusinessError from "../errors/BusinessError.js";
import * as usersRepository from "../repository/users.js";

export async function createUser(req, res) {
  const { username, email, password: rawPassword } = req.body;

  const userFoundByUsername = await usersRepository.findByUsername(username);
  if (userFoundByUsername) {
    throw new BusinessError({
      errorCode: "user-001",
      message: "이미 사용중인 유저이름입니다.",
      statusCode: 409,
    });
  }

  const userFoundByEmail = await usersRepository.findByEmail(email);
  if (userFoundByEmail) {
    throw new BusinessError({
      errorCode: "user-002",
      message: "이미 사용중인 이메일입니다.",
      statusCode: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(rawPassword, config.bcrypt.saltRounds);
  await usersRepository.create({ username, email, password: hashedPassword });

  res.status(200).send();
}

export async function getUserByUsername(req, res) {
  const { username } = req.params;

  const userFoundByUsername = await usersRepository.findByUsername(username);

  if (!userFoundByUsername) {
    throw new BusinessError({
      errorCode: "user-004",
      message: "존재하지 않는 유저입니다.",
      statusCode: 404,
    });
  }

  res.status(200).json({
    username: userFoundByUsername.username,
    shortIntroduction: userFoundByUsername.shortIntroduction ?? "",
    introduction: userFoundByUsername.introduction ?? "",
  });
}

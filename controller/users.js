import * as bcrypt from "bcrypt";

import BusinessError from "../errors/BusinessError.js";
import * as usersRepository from "../repository/users.js";

export async function createUser(req, res, next) {
  const { username, email, password: rawPassword } = req.body;
  try {
    const userFoundByUsername = await usersRepository.findByUsername(username);
    if (userFoundByUsername) {
      const duplicatedUsernameError = new BusinessError({
        errorCode: "user-001",
        message: "이미 사용중인 유저이름입니다.",
        statusCode: 409,
      });
      return next(duplicatedUsernameError);
    }
    const userFoundByEmail = await usersRepository.findByEmail(email);
    if (userFoundByEmail) {
      const duplicatedEmailError = new BusinessError({
        errorCode: "user-002",
        message: "이미 사용중인 이메일입니다.",
        statusCode: 409,
      });
      return next(duplicatedEmailError);
    }
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    await usersRepository.create({ username, email, password: hashedPassword });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getUserByUsername(req, res, next) {
  const { username } = req.params;

  try {
    const userFoundByUsername = await usersRepository.findByUsername(username);

    if (!userFoundByUsername) {
      const userNotFoundError = new BusinessError({
        errorCode: "user-004",
        message: "존재하지 않는 유저입니다.",
        statusCode: 404,
      });
      return next(userNotFoundError);
    }

    res.status(200).json({
      username: userFoundByUsername.username,
      shortIntroduction: userFoundByUsername.shortIntroduction ?? "",
      introduction: userFoundByUsername.introduction ?? "",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

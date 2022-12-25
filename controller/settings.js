import * as bcrypt from "bcrypt";

import BusinessError from "../errors/BusinessError.js";
import * as usersRepository from "../repository/users.js";

export async function getSettings(req, res, next) {
  const { id: currentUserId } = req.user;

  try {
    const currentUser = await usersRepository.findById(currentUserId);
    res.status(200).json({
      username: currentUser.username,
      email: currentUser.email,
      shortIntroduction: currentUser.shortIntroduction ?? "",
      introduction: currentUser.introduction ?? "",
    });
  } catch (error) {
    next(error);
  }
}

export async function setUsername(req, res, next) {
  const { id: currentUserId } = req.user;
  const { username: newUsername } = req.body;

  try {
    const userFoundByNewUsername = await usersRepository.findByUsername(newUsername);
    if (userFoundByNewUsername) {
      const duplicatedUsernameError = new BusinessError({
        errorCode: "user-001",
        message: "이미 사용중인 유저이름입니다.",
        statusCode: 409,
      });
      return next(duplicatedUsernameError);
    }
    await usersRepository.updateUsername({ id: currentUserId, newUsername });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
}

export async function setShortIntroduction(req, res, next) {
  const { shortIntroduction } = req.body;
  const { id: currentUserId } = req.user;

  try {
    await usersRepository.updateShortIntroduction({
      id: currentUserId,
      newShortIntroduction: shortIntroduction,
    });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
}

export async function setIntroduction(req, res, next) {
  const { introduction } = req.body;
  const { id: currentUserId } = req.user;

  try {
    await usersRepository.updateIntroduction({ id: currentUserId, newIntroduction: introduction });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
}

export async function setPassword(req, res, next) {
  const { password, newPassword } = req.body;
  const { id: currentUserId } = req.user;

  try {
    const currentUser = await usersRepository.findById(currentUserId);
    const isPasswordValid = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordValid) {
      const passwordInvalidError = new BusinessError({
        statusCode: 409,
        errorCode: "user-003",
        message: "비밀번호가 올바르지 않습니다.",
      });
      return next(passwordInvalidError);
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await usersRepository.updatePassword({ id: currentUserId, newPassword: newHashedPassword });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
}

import * as bcrypt from "bcrypt";

import config from "../config.js";
import AppError from "../error/AppError.js";
import * as userRepository from "../repository/user.js";

export async function getSettings(req, res) {
  const { id: currentUserId } = req.user;
  const currentUser = await userRepository.findById(currentUserId);
  res.status(200).json({
    username: currentUser.username,
    email: currentUser.email,
    shortIntroduction: currentUser.shortIntroduction ?? "",
    introduction: currentUser.introduction ?? "",
  });
}

export async function setUsername(req, res) {
  const { id: currentUserId } = req.user;
  const { username: newUsername } = req.body;

  const userFoundByNewUsername = await userRepository.findByUsername(newUsername);
  if (userFoundByNewUsername) {
    throw new AppError({
      message: "이미 사용중인 유저이름입니다",
      statusCode: 409,
    });
  }
  await userRepository.updateUsername({ id: currentUserId, newUsername });
  res.status(204).json({});
}

export async function setShortIntroduction(req, res) {
  const { shortIntroduction } = req.body;
  const { id: currentUserId } = req.user;

  await userRepository.updateShortIntroduction({
    id: currentUserId,
    newShortIntroduction: shortIntroduction,
  });
  res.status(204).json({});
}

export async function setIntroduction(req, res) {
  const { introduction } = req.body;
  const { id: currentUserId } = req.user;

  await userRepository.updateIntroduction({ id: currentUserId, newIntroduction: introduction });
  res.status(204).json({});
}

export async function setPassword(req, res) {
  const { password, newPassword } = req.body;
  const { id: currentUserId } = req.user;

  const currentUser = await userRepository.findById(currentUserId);
  const isPasswordValid = await bcrypt.compare(password, currentUser.password);
  if (!isPasswordValid) {
    throw new AppError({
      statusCode: 409,
      message: "비밀번호가 올바르지 않습니다",
    });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
  await userRepository.updatePassword({ id: currentUserId, newPassword: newHashedPassword });
  res.status(204).json({});
}

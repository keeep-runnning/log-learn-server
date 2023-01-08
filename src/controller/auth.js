import * as bcrypt from "bcrypt";

import config from "../config.js";
import AppError from "../error/AppError.js";
import { createToken } from "../lib/jwt-token.js";
import * as userRepository from "../repository/user.js";

export async function signup(req, res) {
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
  const createdUser = await userRepository.create({ username, email, password: hashedPassword });

  res.status(201).json({
    userId: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
  });
}

export async function login(req, res, next) {
  const { email, password: rawPassword } = req.body;

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError({
      message: "이메일 혹은 비밀번호가 유효하지 않습니다",
      statusCode: 401,
    });
  }

  const isPasswordMatched = await bcrypt.compare(rawPassword, user.password);

  if (!isPasswordMatched) {
    throw new AppError({
      message: "이메일 혹은 비밀번호가 유효하지 않습니다",
      statusCode: 401,
    });
  }

  const token = await createToken({ userId: user.id });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Strict",
  });
  res.json({ username: user.username });
}

export async function me(req, res) {
  const user = await userRepository.findById(req.user.id);
  res.json({ username: user.username });
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.sendStatus(204);
}

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

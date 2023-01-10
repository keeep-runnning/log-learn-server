import * as bcrypt from "bcrypt";

import config from "../config.js";
import AppError from "../error/AppError.js";
import { createToken } from "../lib/jwtToken.js";
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

export async function login(req, res) {
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

  res.json({
    userId: user.id,
    username: user.username,
  });
}

export async function me(req, res) {
  const { id: userId } = req.user;

  const user = await userRepository.findById(userId);

  res.json({
    userId: user.id,
    username: user.username,
  });
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.sendStatus(204);
}

export async function getSettings(req, res) {
  const { id: userId } = req.user;

  const user = await userRepository.findById(userId);

  res.json({
    username: user.username,
    email: user.email,
    shortIntroduction: user.shortIntroduction ?? "",
    introduction: user.introduction ?? "",
  });
}

export async function setUsername(req, res) {
  const { id: userId } = req.user;
  const { username: newUsername } = req.body;

  const userFoundByNewUsername = await userRepository.findByUsername(newUsername);
  if (userFoundByNewUsername) {
    throw new AppError({
      message: "이미 사용중인 유저이름입니다",
      statusCode: 409,
    });
  }

  const updatedUsername = await userRepository.updateUsername({ id: userId, newUsername });

  res.json({ username: updatedUsername });
}

export async function setShortIntroduction(req, res) {
  const { id: userId } = req.user;
  const { shortIntroduction: newShortIntroduction } = req.body;

  const updatedShortIntroduction = await userRepository.updateShortIntroduction({
    id: userId,
    newShortIntroduction,
  });

  res.json({ shortIntroduction: updatedShortIntroduction });
}

export async function setIntroduction(req, res) {
  const { id: userId } = req.user;
  const { introduction: newIntroduction } = req.body;

  const updatedIntroduction = await userRepository.updateIntroduction({
    id: userId,
    newIntroduction,
  });

  res.json({ introduction: updatedIntroduction });
}

export async function setPassword(req, res) {
  const { id: userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  const user = await userRepository.findById(userId);
  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError({
      statusCode: 409,
      message: "비밀번호가 올바르지 않습니다",
    });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
  await userRepository.updatePassword({ id: userId, newPassword: newHashedPassword });

  res.sendStatus(204);
}

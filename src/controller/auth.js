import * as bcrypt from "bcrypt";

import config from "../lib/config.js";
import EmailAlreadyExistError from "../error/auth/EmailAlreadyExistError.js";
import InvalidCredentialsError from "../error/auth/InvalidCredentialsError.js";
import InvalidOldPasswordError from "../error/auth/InvalidOldPasswordError.js";
import UsernameAlreadyExistError from "../error/auth/UsernameAlreadyExistError.js";
import { createToken } from "../lib/jwtToken.js";
import * as userRepository from "../repository/user.js";

const tokenCookieOptions =
  config.env === "production"
    ? {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      }
    : {
        httpOnly: true,
      };

export async function signup(req, res) {
  const { username, email, password: rawPassword } = req.body;

  const userFoundByUsername = await userRepository.findByUsername(username);
  if (userFoundByUsername) {
    throw new UsernameAlreadyExistError();
  }

  const userFoundByEmail = await userRepository.findByEmail(email);
  if (userFoundByEmail) {
    throw new EmailAlreadyExistError();
  }

  const hashedPassword = await bcrypt.hash(
    rawPassword,
    config.bcrypt.saltRounds
  );
  const createdUser = await userRepository.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    shortIntroduction: createdUser.shortIntroduction ?? "",
    introduction: createdUser.introduction ?? "",
  });
}

export async function login(req, res) {
  const { email, password: rawPassword } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isPasswordMatched = await bcrypt.compare(rawPassword, user.password);
  if (!isPasswordMatched) {
    throw new InvalidCredentialsError();
  }

  const token = await createToken({ userId: user.id });

  res.cookie("token", token, tokenCookieOptions);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    shortIntroduction: user.shortIntroduction ?? "",
    introduction: user.introduction ?? "",
  });
}

export async function me(req, res) {
  const { id: userId } = req.user;

  const user = await userRepository.findById(userId);

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    shortIntroduction: user.shortIntroduction ?? "",
    introduction: user.introduction ?? "",
  });
}

export async function logout(req, res) {
  res.clearCookie("token", tokenCookieOptions);
  res.sendStatus(204);
}

export async function setUsername(req, res) {
  const { id: userId } = req.user;
  const { username: newUsername } = req.body;

  const userFoundByNewUsername = await userRepository.findByUsername(
    newUsername
  );
  if (userFoundByNewUsername) {
    throw new UsernameAlreadyExistError();
  }

  const updatedUsername = await userRepository.updateUsername({
    id: userId,
    newUsername,
  });

  res.json({ username: updatedUsername });
}

export async function setShortIntroduction(req, res) {
  const { id: userId } = req.user;
  const { shortIntroduction: newShortIntroduction } = req.body;

  const updatedShortIntroduction = await userRepository.updateShortIntroduction(
    {
      id: userId,
      newShortIntroduction,
    }
  );

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
    throw new InvalidOldPasswordError();
  }

  const newHashedPassword = await bcrypt.hash(
    newPassword,
    config.bcrypt.saltRounds
  );
  await userRepository.updatePassword({
    id: userId,
    newPassword: newHashedPassword,
  });

  res.sendStatus(204);
}

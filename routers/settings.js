import express from "express";
import bcrypt from "bcrypt";
import { isLoggedIn } from "./middlewares/auth.js";
import db from "../models/index.js";
import {
  validateUsernameUpdateRequestBody,
  validateShortIntroductionUpdateRequestBody,
  validatePasswordUpdateRequestBody,
} from "./middlewares/validation.js";
import BusinessError from "../errors/BusinessError.js";

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
  const { id } = req.user;

  try {
    const userFoundById = await db.User.findOne({ where: { id } });
    res.status(200).json({
      username: userFoundById.username,
      email: userFoundById.email,
      shortIntroduction: userFoundById.shortIntroduction ?? "",
      introduction: userFoundById.introduction ?? "",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/username", isLoggedIn, validateUsernameUpdateRequestBody, async (req, res, next) => {
  const { id } = req.user;
  const { username: newUsername } = req.body;

  try {
    const userFoundByNewUsername = await db.User.findOne({ where: { username: newUsername } });
    if (userFoundByNewUsername) {
      const duplicatedUsernameError = new BusinessError({
        errorCode: "user-001",
        message: "이미 사용중인 유저이름입니다.",
        statusCode: 409,
      });
      return next(duplicatedUsernameError);
    }

    const currentUser = await db.User.findOne({ where: { id } });
    await currentUser.update({ username: newUsername });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/short-introduction",
  isLoggedIn,
  validateShortIntroductionUpdateRequestBody,
  async (req, res, next) => {
    const { shortIntroduction } = req.body;
    const { id: currentUserId } = req.user;

    try {
      const currentUser = await db.User.findOne({ where: { id: currentUserId } });
      await currentUser.update({ shortIntroduction });
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/introduction", isLoggedIn, async (req, res, next) => {
  const { introduction } = req.body;
  const { id: currentUserId } = req.user;

  try {
    const currentUser = await db.User.findOne({ where: { id: currentUserId } });
    await currentUser.update({ introduction });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
});

router.patch("/password", isLoggedIn, validatePasswordUpdateRequestBody, async (req, res, next) => {
  const { password, newPassword } = req.body;
  const { id: currentUserId } = req.user;

  try {
    const currentUser = await db.User.findOne({ where: { id: currentUserId } });
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
    await currentUser.update({ password: newHashedPassword });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
});

export default router;

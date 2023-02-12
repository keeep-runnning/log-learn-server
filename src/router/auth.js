import express from "express";

import * as authController from "../controller/auth.js";
import validate from "../middleware/validate.js";
import {
  usernameBodyValidator,
  emailBodyValidator,
  passwordBodyValidator,
  shortIntroductionBodyValidator,
  newPasswordBodyValidator,
  introductionBodyValidator,
  oldPasswordBodyValidator,
} from "../middleware/userRequestValidator.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post(
  "/signup",
  usernameBodyValidator,
  emailBodyValidator,
  passwordBodyValidator,
  validate,
  authController.signup
);

router.post("/login", authController.login);

router.get("/me", isAuthenticated, authController.me);

router.post("/logout", authController.logout);

router.put(
  "/me/username",
  isAuthenticated,
  usernameBodyValidator,
  validate,
  authController.setUsername
);

router.put(
  "/me/short-introduction",
  isAuthenticated,
  shortIntroductionBodyValidator,
  validate,
  authController.setShortIntroduction
);

router.put(
  "/me/introduction",
  isAuthenticated,
  introductionBodyValidator,
  validate,
  authController.setIntroduction
);

router.put(
  "/me/password",
  isAuthenticated,
  oldPasswordBodyValidator,
  newPasswordBodyValidator,
  validate,
  authController.setPassword
);

export default router;

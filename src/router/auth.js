import express from "express";

import * as authController from "../controller/auth.js";
import validate from "../middleware/validate.js";
import {
  usernameBodyValidator,
  emailBodyValidator,
  passwordBodyValidator,
  shortIntroductionBodyValidator,
  newPasswordBodyValidator,
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

router.get("/me", isAuthenticated, authController.getCurrentUser);

router.post("/logout", authController.logout);

router.get("/settings", isAuthenticated, authController.getSettings);

router.put(
  "/settings/username",
  isAuthenticated,
  usernameBodyValidator,
  validate,
  authController.setUsername
);

router.put(
  "/settings/short-introduction",
  isAuthenticated,
  shortIntroductionBodyValidator,
  validate,
  authController.setShortIntroduction
);

router.put("/settings/introduction", isAuthenticated, authController.setIntroduction);

router.put(
  "/settings/password",
  isAuthenticated,
  newPasswordBodyValidator,
  validate,
  authController.setPassword
);

export default router;

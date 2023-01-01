import express from "express";

import * as settingController from "../controller/setting.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import validate from "../middleware/validate.js";
import {
  newPasswordBodyValidator,
  shortIntroductionBodyValidator,
  usernameBodyValidator,
} from "../middleware/userRequestValidator.js";

const router = express.Router();

router.get("/", isAuthenticated, settingController.getSettings);

router.patch(
  "/username",
  isAuthenticated,
  usernameBodyValidator,
  validate,
  settingController.setUsername
);

router.patch(
  "/short-introduction",
  isAuthenticated,
  shortIntroductionBodyValidator,
  validate,
  settingController.setShortIntroduction
);

router.patch("/introduction", isAuthenticated, settingController.setIntroduction);

router.patch(
  "/password",
  isAuthenticated,
  newPasswordBodyValidator,
  validate,
  settingController.setPassword
);

export default router;

import express from "express";

import { isAuthenticated } from "../middleware/auth.js";
import {
  validateUsernameUpdateRequestBody,
  validateShortIntroductionUpdateRequestBody,
  validatePasswordUpdateRequestBody,
} from "../middleware/validation.js";
import * as settingsController from "../controller/settings.js";

const router = express.Router();

router.get("/", isAuthenticated, settingsController.getSettings);
router.patch(
  "/username",
  isAuthenticated,
  validateUsernameUpdateRequestBody,
  settingsController.setUsername
);
router.patch(
  "/short-introduction",
  isAuthenticated,
  validateShortIntroductionUpdateRequestBody,
  settingsController.setShortIntroduction
);
router.patch("/introduction", isAuthenticated, settingsController.setIntroduction);
router.patch(
  "/password",
  isAuthenticated,
  validatePasswordUpdateRequestBody,
  settingsController.setPassword
);

export default router;

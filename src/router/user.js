import express from "express";

import * as userController from "../controller/user.js";
import validate from "../middleware/validate.js";
import {
  usernameBodyValidator,
  emailBodyValidator,
  passwordBodyValidator,
} from "../middleware/userRequestValidator.js";

const router = express.Router();

router.post(
  "/",
  usernameBodyValidator,
  emailBodyValidator,
  passwordBodyValidator,
  validate,
  userController.createUser
);

router.get("/:username", userController.getUserByUsername);

export default router;

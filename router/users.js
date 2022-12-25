import express from "express";

import { validateUserCreationRequestBody } from "../middleware/validation.js";
import * as usersController from "../controller/users.js";

const router = express.Router();

router.post("/", validateUserCreationRequestBody, usersController.createUser);

router.get("/:username", usersController.getUserByUsername);

export default router;

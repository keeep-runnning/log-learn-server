import express from "express";

import * as userController from "../controller/user.js";

const router = express.Router();

router.get("/:username", userController.getUserByUsername);

export default router;

import express from "express";

import * as authController from "../controller/auth.js";

const router = express.Router();

router.post("/login", authController.login);
router.get("/current-user", authController.getCurrentUser);
router.post("/logout", authController.logout);

export default router;

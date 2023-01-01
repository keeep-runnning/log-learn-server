import express from "express";
import { body } from "express-validator";

import * as settingsController from "../controller/settings.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.get("/", isAuthenticated, settingsController.getSettings);

router.patch(
  "/username",
  isAuthenticated,
  body("username")
    .notEmpty()
    .withMessage("유저이름을 입력해주세요.")
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage("유저이름을 2자 이상 20자 이하로 입력해주세요.")
    .bail()
    .matches(/^[ㄱ-ㅎ가-힣\w-]+$/)
    .withMessage("한글/영문 대소문자/숫자/언더바(_)/하이픈(-)만을 이용해 유저이름을 입력해주세요."),
  validate,
  settingsController.setUsername
);

router.patch(
  "/short-introduction",
  isAuthenticated,
  body("shortIntroduction")
    .isLength({ max: 120 })
    .withMessage("짧은 소개는 최대 120자 까지 입력할 수 있습니다."),
  validate,
  settingsController.setShortIntroduction
);

router.patch("/introduction", isAuthenticated, settingsController.setIntroduction);

router.patch(
  "/password",
  isAuthenticated,
  body("newPassword")
    .notEmpty()
    .withMessage("새 비밀번호를 입력해주세요.")
    .bail()
    .isLength({ min: 8, max: 32 })
    .withMessage("새 비밀번호를 8자 이상 32자 이하로 입력해주세요.")
    .bail()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/)
    .withMessage("영문 대소문자/숫자/특수문자를 각각 1자 이상 포함해주세요."),
  validate,
  settingsController.setPassword
);

export default router;

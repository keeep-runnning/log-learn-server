import express from "express";
import { body } from "express-validator";

import * as userController from "../controller/user.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",
  body("username")
    .notEmpty()
    .withMessage("유저이름을 입력해주세요.")
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage("유저이름을 2자 이상 20자 이하로 입력해주세요.")
    .bail()
    .matches(/^[ㄱ-ㅎ가-힣\w-]+$/)
    .withMessage("한글/영문 대소문자/숫자/언더바(_)/하이픈(-)만을 이용해 유저이름을 입력해주세요."),
  body("email")
    .notEmpty()
    .withMessage("이메일을 입력해주세요.")
    .bail()
    .matches(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/)
    .withMessage("이메일 형식이 올바르지 않습니다."),
  body("password")
    .notEmpty()
    .withMessage("비밀번호를 입력해주세요.")
    .bail()
    .isLength({ min: 8, max: 32 })
    .withMessage("비밀번호를 8자 이상 32자 이하로 입력해주세요.")
    .bail()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/)
    .withMessage("영문 대소문자/숫자/특수문자를 각각 1자 이상 포함해주세요."),
  validate,
  userController.createUser
);

router.get("/:username", userController.getUserByUsername);

export default router;

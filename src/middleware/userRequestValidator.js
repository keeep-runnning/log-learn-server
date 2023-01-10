import { body } from "express-validator";

export const usernameBodyValidator = body("username")
  .isString()
  .withMessage("유저이름이 유효하지 않습니다")
  .bail()
  .notEmpty()
  .withMessage("유저이름을 입력해주세요")
  .bail()
  .isLength({ min: 2, max: 20 })
  .withMessage("유저이름을 2자 이상 20자 이하로 입력해주세요")
  .bail()
  .matches(/^[ㄱ-ㅎ가-힣\w-]+$/)
  .withMessage("한글/영문 대소문자/숫자/언더바(_)/하이픈(-)만을 이용해 유저이름을 입력해주세요");

export const emailBodyValidator = body("email")
  .isString()
  .withMessage("이메일이 유효하지 않습니다")
  .bail()
  .notEmpty()
  .withMessage("이메일을 입력해주세요")
  .bail()
  .matches(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/)
  .withMessage("이메일 형식이 올바르지 않습니다");

const PASSWORD_LENGTH = { min: 8, max: 32 };
const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/;

export const passwordBodyValidator = body("password")
  .isString()
  .withMessage("비밀번호가 유효하지 않습니다")
  .bail()
  .notEmpty()
  .withMessage("비밀번호를 입력해주세요")
  .bail()
  .isLength(PASSWORD_LENGTH)
  .withMessage("비밀번호를 8자 이상 32자 이하로 입력해주세요")
  .bail()
  .matches(PASSWORD_PATTERN)
  .withMessage("영문 대소문자/숫자/특수문자를 각각 1자 이상 포함해주세요");

export const oldPasswordBodyValidator = body("oldPassword")
  .isString()
  .withMessage("기존 비밀번호가 유효하지 않습니다")
  .bail()
  .notEmpty()
  .withMessage("기존 비밀번호를 입력해주세요");

export const newPasswordBodyValidator = body("newPassword")
  .isString()
  .withMessage("새 비밀번호가 유효하지 않습니다")
  .bail()
  .notEmpty()
  .withMessage("새 비밀번호를 입력해주세요")
  .bail()
  .isLength(PASSWORD_LENGTH)
  .withMessage("새 비밀번호를 8자 이상 32자 이하로 입력해주세요")
  .bail()
  .matches(PASSWORD_PATTERN)
  .withMessage("영문 대소문자/숫자/특수문자를 각각 1자 이상 포함해주세요");

export const shortIntroductionBodyValidator = body("shortIntroduction")
  .isString()
  .withMessage("짧은 소개가 유효하지 않습니다")
  .bail()
  .trim()
  .isLength({ max: 120 })
  .withMessage("짧은 소개는 최대 120자 까지 입력할 수 있습니다");

export const introductionBodyValidator = body("introduction")
  .isString()
  .withMessage("소개가 유효하지 않습니다")
  .trim();

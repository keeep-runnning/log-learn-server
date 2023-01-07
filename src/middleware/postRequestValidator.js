import { body, param } from "express-validator";

export const postIdParamValidator = param("postId")
  .isInt()
  .withMessage("블로그 포스트 id가 유효하지 않습니다")
  .toInt();

export const titleBodyValidator = body("title")
  .trim()
  .notEmpty()
  .withMessage("블로그 포스트 제목을 입력해주세요")
  .bail()
  .isLength({ max: 100 })
  .withMessage("블로그 포스트 제목은 최대 100자까지 입력할 수 있습니다");

export const contentBodyValidator = body("content")
  .trim()
  .notEmpty()
  .withMessage("블로그 포스트 내용을 입력해주세요");

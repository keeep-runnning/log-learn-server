import express from "express";
import { body } from "express-validator";

import * as postsController from "../controller/posts.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.get("/:postId", postsController.getPostById);

router.get("/", postsController.getPostsByAuthorName);

router.post(
  "/",
  isAuthenticated,
  body("title")
    .trim()
    .notEmpty()
    .withMessage("블로그 포스트 제목을 입력해주세요.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("블로그 포스트 제목은 최대 100자까지 입력할 수 있습니다."),
  body("content").trim().notEmpty().withMessage("블로그 포스트 내용을 입력해주세요."),
  validate,
  postsController.createPost
);

router.patch(
  "/:postId",
  isAuthenticated,
  body("title")
    .trim()
    .notEmpty()
    .withMessage("블로그 포스트 제목을 입력해주세요.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("블로그 포스트 제목은 최대 100자까지 입력할 수 있습니다."),
  body("content").trim().notEmpty().withMessage("블로그 포스트 내용을 입력해주세요."),
  validate,
  postsController.updatePost
);

router.delete("/:postId", isAuthenticated, postsController.removePost);

export default router;

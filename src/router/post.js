import express from "express";

import * as postController from "../controller/post.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import validate from "../middleware/validate.js";
import {
  titleBodyValidator,
  contentBodyValidator,
  postIdParamValidator,
  authorNameQueryValidator,
  cursorQueryValidator,
} from "../middleware/postRequestValidator.js";

const router = express.Router();

router.get(
  "/:postId",
  postIdParamValidator,
  validate,
  postController.getPostById
);

router.get(
  "/",
  authorNameQueryValidator,
  cursorQueryValidator,
  validate,
  postController.getPostsByAuthorName
);

router.post(
  "/",
  isAuthenticated,
  titleBodyValidator,
  contentBodyValidator,
  validate,
  postController.createPost
);

router.patch(
  "/:postId",
  isAuthenticated,
  postIdParamValidator,
  titleBodyValidator,
  contentBodyValidator,
  validate,
  postController.updatePost
);

router.delete(
  "/:postId",
  isAuthenticated,
  postIdParamValidator,
  validate,
  postController.removePost
);

export default router;

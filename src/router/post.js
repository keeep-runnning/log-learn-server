import express from "express";

import * as postController from "../controller/post.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import validate from "../middleware/validate.js";
import { titleBodyValidator, contentBodyValidator } from "../middleware/postRequestValidator.js";

const router = express.Router();

router.get("/:postId", postController.getPostById);

router.get("/", postController.getPostsByAuthorName);

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
  titleBodyValidator,
  contentBodyValidator,
  validate,
  postController.updatePost
);

router.delete("/:postId", isAuthenticated, postController.removePost);

export default router;

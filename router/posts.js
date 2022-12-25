import express from "express";

import { isAuthenticated } from "../middleware/auth.js";
import {
  validatePostCreationRequestBody,
  validatePostUpdateRequestBody,
} from "../middleware/validation.js";
import * as postsController from "../controller/posts.js";

const router = express.Router();

router.get("/:postId", postsController.getPostById);
router.get("/", postsController.getPostsByAuthorName);
router.post("/", isAuthenticated, validatePostCreationRequestBody, postsController.createPost);
router.patch(
  "/:postId",
  isAuthenticated,
  validatePostUpdateRequestBody,
  postsController.updatePost
);
router.delete("/:postId", isAuthenticated, postsController.removePost);

export default router;

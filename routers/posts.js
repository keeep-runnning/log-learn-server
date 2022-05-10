const express = require("express");

const { Post, User } = require("../models");
const { BusinessError } = require("../errors/BusinessError");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { title, content } = req.body;
  const { id: authorId } = req.user;
  try {
    const { id: postId } = await Post.create({
      title,
      content,
      UserId: authorId
    });
    const newPost = await Post.findOne({
      where: { id: postId },
      include: {
        model: User,
        attributes: ["username"]
      }
    });
    return res.status(201)
      .json({
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        author: newPost.User.username,
        createdAt: newPost.createdAt
      });
  } catch(error) {
    console.error(error);
    next(error);
  }
});

router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({
      where: { id : postId },
      include: {
        model: User,
        attributes: ["username"]
      }
    });
    if(!post) {
      const postNotFoundError = new BusinessError({
        errorCode: "post-001",
        message: "블로그 포스트가 없습니다.",
        errors: [],
        statusCode: 404
      });
      return next(postNotFoundError);
    }
    return res.json({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.User.username,
      createdAt: post.createdAt
    });
  } catch(error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

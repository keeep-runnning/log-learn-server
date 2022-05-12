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
        id: String(newPost.id),
        title: newPost.title,
        content: newPost.content,
        author: newPost.User.username,
        createdAt: newPost.createdAt.toISOString()
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
        statusCode: 404
      });
      return next(postNotFoundError);
    }
    return res.json({
      id: String(post.id),
      title: post.title,
      content: post.content,
      author: post.User.username,
      createdAt: post.createdAt.toISOString()
    });
  } catch(error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:postId", async (req, res, next) => {
  if(!req.user) {
    const notLoggedInError = new BusinessError({
      message: "로그인이 필요합니다.",
      statusCode: 401,
      errorCode: "common-002"
    });
    return next(notLoggedInError);
  }

  const { postId } = req.params;
  const { title, content } = req.body;
  try{
    const postFoundById = await Post.findOne({
      where: {
        id: postId
      },
      include: [
        { model: User, attributes: ["id", "username"] }
      ]
    });
    if(!postFoundById) {
      const postNotFoundError = new BusinessError({
        message: "블로그 포스트가 없습니다.",
        statusCode: 404,
        errorCode: "post-001"
      });
      return next(postNotFoundError);
    }
    if(postFoundById.User.id !== req.user.id) {
      const notAuthorizedError = new BusinessError({
        message: "권한이 없습니다.",
        statusCode: 403,
        errorCode: "common-003"
      });
      return next(notAuthorizedError);
    }
    await postFoundById.update({ title, content });
    return res.status(204).json();
  } catch(error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

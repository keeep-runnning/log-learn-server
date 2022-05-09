const express = require("express");

const { Post, User } = require("../models");

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

module.exports = router;

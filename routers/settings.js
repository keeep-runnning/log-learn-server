const express = require("express");

const { isLoggedIn } = require("./middlewares/auth");
const { User } = require("../models");
const { validateUsernameUpdateRequestBody } = require("./middlewares/validation");
const { BusinessError } = require("../errors/BusinessError");

const router = express.Router();

router.get(
  "/",
  isLoggedIn,
  async (req, res, next) => {
    const { id } = req.user;

    try {
      const userFoundById = await User.findOne({ where: { id } });
      res.status(200)
        .json({
          username: userFoundById.username,
          email: userFoundById.email,
          shortIntroduction: userFoundById.shortIntroduction ?? "",
          introduction: userFoundById.introduction ?? ""
        });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/username",
  isLoggedIn,
  validateUsernameUpdateRequestBody,
  async (req, res, next) => {
    const { id } = req.user;
    const { username: newUsername } = req.body;

    try {
      const userFoundByNewUsername = await User.findOne({ where: { username: newUsername } });
      if (userFoundByNewUsername) {
        const duplicatedUsernameError = new BusinessError({
          errorCode: "user-001",
          message: "이미 사용중인 유저이름입니다.",
          statusCode: 409
        });
        return next(duplicatedUsernameError);
      }

      const currentUser = await User.findOne({ where: { id } });
      await currentUser.update({ username: newUsername });
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

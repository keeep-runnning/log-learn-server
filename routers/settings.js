const express = require("express");

const { isLoggedIn } = require("./middlewares/auth");
const { User } = require("../models");

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

module.exports = router;

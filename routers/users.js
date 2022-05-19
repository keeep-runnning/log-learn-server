const express = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models");
const { validateUserCreationRequestBody } = require("./middlewares/validation");
const { BusinessError } = require("../errors/BusinessError");

const router = express.Router();

router.post(
  "/",
  validateUserCreationRequestBody,
  async (req, res, next) => {
    const { username, email, password: rawPassword } = req.body;
    try {
      const userFoundByUsername = await User.findOne({ where: { username } });
      if(userFoundByUsername) {
        const duplicatedUsernameError = new BusinessError({
          errorCode: "user-001",
          message: "이미 사용중인 유저이름입니다.",
          statusCode: 409
        });
        return next(duplicatedUsernameError);
      }
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      await User.create({ username, email, password: hashedPassword });
      res.status(200).send();
    } catch(error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;

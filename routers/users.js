const express = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models");
const { validate, validateUserCreationRequestBody } = require("./middlewares/validation");

const router = express.Router();

router.post(
  "/",
  validate(validateUserCreationRequestBody),
  async (req, res, next) => {
    const { username, email, password: rawPassword } = req.body;
    try {
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

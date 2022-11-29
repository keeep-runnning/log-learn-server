const passport = require("passport");

const local = require("./localStrategy");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    User.findOne({ where: { id: userId } })
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });

  local();
};
